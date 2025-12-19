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
		});

		await db.transaction(async (tx) => {
			// insert user/profiles
			const users = await tx
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
			const services = await tx
				.select()
				.from(serviceTable)
				.where(
					or(...prod.roles.map((role) => eq(serviceTable.name, role.service)))
				);
			await tx
				.insert(roleTable)
				.values([
					...prod.roles.map((role) => ({
						...role,
						serviceId: services.find(
							(service) => service.name === role.service
						)!.id,
					})),
				])
				.onConflictDoNothing();

			for (const role of prod.roles) {
				const permissions = await tx
					.select(getTableColumns(permissionTable))
					.from(permissionTable)
					.innerJoin(
						serviceTable,
						eq(serviceTable.id, permissionTable.serviceId)
					)
					.where(
						or(
							...role.permissions.map((permission) =>
								and(
									eq(serviceTable.name, permission.split(':')[0]),
									eq(permissionTable.key, permission.split(':')[1])
								)
							)
						)
					);

				if (permissions.length > 0) {
					await tx
						.insert(rolePermissionTable)
						.values(
							permissions.map((permission) => ({
								permissionId: permission.id,
								roleId: role.id,
							}))
						)
						.onConflictDoNothing();
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
