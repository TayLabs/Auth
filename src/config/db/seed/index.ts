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
import { eq, or } from 'drizzle-orm';

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
			await tx.insert(roleTable).values(prod.roles).onConflictDoNothing();

			for (const role of prod.roles) {
				const permissions = await tx
					.select()
					.from(permissionTable)
					.where(
						or(
							...role.permissions.map((permission) =>
								eq(permissionTable.key, permission)
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
