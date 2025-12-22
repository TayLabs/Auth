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
import fetchPermissions from '../utils/fetchPermissions';
import { and, eq, getTableColumns, or } from 'drizzle-orm';

export default async function seed(options?: { includeTestData: boolean }) {
	try {
		const config = await fetchPermissions();

		await db.transaction(async (tx) => {
			// insert service, roles, and permissions
			await tx
				.insert(serviceTable)
				.values(
					config.map((repo) => ({
						name: repo.service,
					}))
				)
				.onConflictDoNothing();

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
							}))
						)
						.onConflictDoNothing();
				}
			}
			const permissions = await db
				.select({
					...getTableColumns(permissionTable),
					service: getTableColumns(serviceTable),
				})
				.from(permissionTable)
				.innerJoin(
					serviceTable,
					eq(serviceTable.id, permissionTable.serviceId)
				);

			// insert user/profiles
			await tx
				.insert(userTable)
				.values(
					await Promise.all(
						prod.users.map(async (user) => ({
							...user,
							passwordHash: await Password.hashAsync(user.passwordHash),
						}))
					)
				)
				.onConflictDoNothing();
			await tx.insert(profileTable).values(prod.profiles).onConflictDoNothing();

			// insert service, roles, and permissions
			await tx.insert(roleTable).values(prod.roles).onConflictDoNothing();

			for (const role of prod.roles) {
				const current = await tx
					.select({
						...getTableColumns(permissionTable),
						service: serviceTable.name,
					})
					.from(permissionTable)
					.innerJoin(
						serviceTable,
						eq(serviceTable.id, permissionTable.serviceId)
					)
					.innerJoin(
						rolePermissionTable,
						eq(rolePermissionTable.permissionId, permissionTable.id)
					)
					.where(eq(rolePermissionTable.roleId, role.id));

				const toAdd = role.permissions
					.filter(
						(permissionKey) =>
							!current.find(
								(permission) =>
									permission.service === permissionKey.split(':')[0] &&
									permission.key === permissionKey.split(':')[1]
							)
					)
					.map((key) => ({
						permissionId: permissions.find(
							(permission) =>
								permission.service.name === key.split(':')[0] &&
								permission.key === key.split(':')[1]
						)!.id,
						roleId: role.id,
					}));
				const toRemove = current.filter(
					(permission) =>
						!role.permissions.includes(
							`${permission.service}:${permission.key}`
						)
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
									eq(rolePermissionTable.permissionId, permission.id)
								)
							)
						);
				}
			}
			for (const user of prod.users) {
				const filtered = prod.roles.filter((role) =>
					user.roles.includes(role.name)
				);
				if (filtered.length > 0) {
					await tx
						.insert(userRoleTable)
						.values(
							filtered.map((role) => ({
								userId: user.id,
								roleId: role.id,
							}))
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
