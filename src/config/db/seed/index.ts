import Password from '@/auth/utils/Password.util';
import { db } from '..';
import {
	userTable,
	profileTable,
	serviceTable,
	roleTable,
	permissionTable,
	rolePermissionTable,
	userRoleTable,
} from '../schema/index.schema';
import prod from './prod.data';
import testData from './test.data';
import fetchPermissions from '../utils/fetchPermissions';
import { eq, getTableColumns, or, sql } from 'drizzle-orm';
import { UUID } from 'node:crypto';

export default async function seed(options?: { includeTestData: boolean }) {
	try {
		const config = options?.includeTestData
			? testData.serviceConfigs
			: await fetchPermissions();

		await db.transaction(async (tx) => {
			// insert service, roles, and permissions (only if config exists)
			if (config.length > 0) {
				await tx
					.insert(serviceTable)
					.values(
						config.map((repo) => ({
							name: repo.service,
						})),
					)
					.onConflictDoNothing();
			}

			const services = await tx.select().from(serviceTable);

			for (const service of services) {
				const repo = config.find((repo) => repo.service === service.name);

				if (repo?.permissions && repo.permissions.length > 0) {
					await tx
						.insert(permissionTable)
						.values(
							repo?.permissions.map((permission) => ({
								...permission,
								serviceId: service.id,
							})),
						)
						.onConflictDoNothing();
				}
			}
			const permissions = await tx
				.select({
					...getTableColumns(permissionTable),
					service: getTableColumns(serviceTable),
				})
				.from(permissionTable)
				.innerJoin(
					serviceTable,
					eq(serviceTable.id, permissionTable.serviceId),
				);

			await tx
				.insert(userTable)
				.values(
					await Promise.all(
						(options?.includeTestData ? testData.users : prod.users).map(
							async (user) => ({
								...user,
								passwordHash: await Password.hashAsync(user.passwordHash),
							}),
						),
					),
				)
				.onConflictDoNothing();
			await tx
				.insert(profileTable)
				.values(options?.includeTestData ? testData.profiles : prod.profiles)
				.onConflictDoNothing();

			// insert service, roles, and permissions
			await tx
				.insert(roleTable)
				.values(
					(options?.includeTestData ? testData.roles : prod.roles).map(
						(role) => ({ ...role, isExternal: false }),
					),
				) // all seeded roles are internal only and cannot be edited
				.onConflictDoUpdate({
					target: roleTable.id,
					set: {
						name: sql.raw(`excluded.${roleTable.name.name}`),
						assignToNewUser: sql.raw(
							`excluded.${roleTable.assignToNewUser.name}`,
						),
						isExternal: sql.raw(`excluded.${roleTable.isExternal.name}`),
					},
				});

			for (const role of options?.includeTestData
				? testData.roles
				: prod.roles) {
				const current = await tx
					.select({
						...getTableColumns(permissionTable),
						service: serviceTable.name,
					})
					.from(permissionTable)
					.innerJoin(
						serviceTable,
						eq(serviceTable.id, permissionTable.serviceId),
					)
					.innerJoin(
						rolePermissionTable,
						eq(rolePermissionTable.permissionId, permissionTable.id),
					)
					.where(eq(rolePermissionTable.roleId, role.id));

				const toAdd = role.permissions
					.filter(
						(permissionKey) =>
							!current.find(
								(permission) =>
									permission.service === permissionKey.split(':')[0] &&
									permission.key === permissionKey.split(':')[1],
							),
					)
					.map((key) => ({
						permissionId:
							permissions.find(
								(permission) =>
									permission.service.name === key.split(':')[0] &&
									permission.key === key.split(':')[1],
							)?.id || ('' as UUID),
						roleId: role.id,
					}));
				const toRemove = current.filter(
					(permission) =>
						!role.permissions.includes(
							`${permission.service}:${permission.key}`,
						),
				);

				if (toAdd.length > 0) {
					await tx.insert(rolePermissionTable).values(toAdd);
				}

				if (toRemove.length > 0) {
					await tx
						.delete(rolePermissionTable)
						.where(
							or(
								...toRemove.map((permission) =>
									eq(rolePermissionTable.permissionId, permission.id),
								),
							),
						);
				}
			}
			for (const user of options?.includeTestData
				? testData.users
				: prod.users) {
				const filtered = (
					options?.includeTestData ? testData.roles : prod.roles
				).filter((role) => user.roles.includes(role.name));
				if (filtered.length > 0) {
					await tx
						.insert(userRoleTable)
						.values(
							filtered.map((role) => ({
								userId: user.id,
								roleId: role.id,
							})),
						)
						.onConflictDoNothing();
				}
			}
		});

		console.log('🌱 Seed data inserted');
	} catch (err) {
		console.error(err);
	}
}
