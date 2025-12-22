import { db } from '@/config/db';
import { userTable } from '@/config/db/schema/user.schema';
import { eq, DrizzleQueryError, getTableColumns, or, and } from 'drizzle-orm';
import { DatabaseError } from 'pg';
import Password from '@/auth/utils/Password.util';
import { profileTable } from '@/config/db/schema/profile.schema';
import type { User as UserType } from '@/interfaces/user.interface';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';
import type { UUID } from 'node:crypto';
import { userRoleTable } from '@/config/db/schema/userRole.schema';
import { roleTable } from '@/config/db/schema/role.schema';
import { permissionTable } from '@/config/db/schema/permission.schema';
import { rolePermissionTable } from '@/config/db/schema/rolePermission.schema';
import { deviceTable } from '@/config/db/schema/device.schema';
import redisClient from '@/config/redis/client';
import { SessionBody } from '@/auth/services/Token.service';

const { passwordHash: _passwordHash, ...userColumns } =
	getTableColumns(userTable);
const { userId: _userId, ...profileColumns } = getTableColumns(profileTable);

export default class User {
	private _userId: UUID;

	constructor(userId: UUID) {
		this._userId = userId;
	}

	public static async getAll(): Promise<UserType[]> {
		const users = await db
			.select({
				...userColumns,
				profile: profileColumns,
			})
			.from(userTable)
			.innerJoin(profileTable, eq(profileTable.userId, userTable.id));

		return users;
	}

	public static async login(email: string, password: string) {
		const user = (
			await db
				.select({ ...getTableColumns(userTable), profile: profileColumns })
				.from(userTable)
				.innerJoin(profileTable, eq(profileTable.userId, userTable.id))
				.where(eq(userTable.email, email))
		)[0];

		if (!user) {
			throw new AppError(
				'User does not exist, try signing up.',
				HttpStatus.NOT_FOUND
			);
		}

		if (!(await Password.verifyAsync(user.passwordHash, password))) {
			throw new AppError('Invalid Password', 401);
		}

		// Remove password hash from user object before returning
		const result: UserType = user;
		delete result.passwordHash;

		return result as UserType;
	}

	public static async create(
		email: string,
		password: string,
		{ firstName, lastName }: { firstName: string; lastName: string }
	) {
		const passwordHash = await Password.hashAsync(password);

		return await db.transaction(async (tx) => {
			try {
				const user = await db
					.insert(userTable)
					.values({
						email,
						passwordHash,
					})
					.returning(userColumns);
				if (!user[0]) throw new Error('User creation failed');

				const profile = await tx
					.insert(profileTable)
					.values({
						userId: user[0].id,
						firstName,
						lastName,
						username: email.split('@')[0],
					})
					.returning(profileColumns);

				return { ...user[0], profile: profile[0] };
			} catch (err) {
				if (
					err instanceof DrizzleQueryError &&
					err.cause instanceof DatabaseError
				) {
					switch (err.cause.code) {
						case '23505': // unique_violation
							throw new Error('Email already in use');
						case '42P01': // undefined_table
							throw new Error('Database table not found');
						default:
							throw err;
					}
				} else {
					throw err;
				}
			}
		});
	}

	public async update(
		data: Partial<
			Omit<
				typeof userTable.$inferInsert,
				'id' | 'email' | 'passwordHash' | 'createdAt'
			>
		>
	) {
		try {
			await db
				.update(userTable)
				.set({
					...data,
					// prevent fields from being modified
					id: undefined,
					email: undefined,
					passwordHash: undefined,
					createdAt: undefined,
				})
				.where(eq(userTable.id, this._userId));
		} catch (err) {
			if (
				err instanceof DrizzleQueryError &&
				err.cause instanceof DatabaseError
			) {
				switch (err.cause.code) {
					// case '23505': // unique_violation
					// 	throw new Error('Unique violation');
					case '42P01': // undefined_table
						throw new Error('Database table not found');
					default:
						throw err;
				}
			} else {
				throw err;
			}
		}
	}

	public async resetPassword(password: string) {
		const passwordHash = await Password.hashAsync(password);

		await db
			.update(userTable)
			.set({
				passwordHash,
				forcePasswordChange: false,
			})
			.where(eq(userTable.id, this._userId));
	}

	public async changePassword(currentPassword: string, newPassword: string) {
		const newPasswordHash = await Password.hashAsync(newPassword);

		const user = (
			await db
				.select({ id: userTable.id, passwordHash: userTable.passwordHash })
				.from(userTable)
				.where(eq(userTable.id, this._userId))
		)[0];

		if (!(await Password.verifyAsync(user.passwordHash, currentPassword))) {
			throw new AppError('Current password is invalid', HttpStatus.BAD_REQUEST);
		}

		if (currentPassword === newPassword) {
			throw new AppError(
				'New password must be different then the current one',
				HttpStatus.BAD_REQUEST
			);
		}

		const result = (
			await db
				.update(userTable)
				.set({
					passwordHash: newPasswordHash,
					forcePasswordChange: false,
				})
				.where(eq(userTable.id, this._userId))
				.returning({ id: userTable.id })
		)[0];

		if (!result) {
			throw new AppError(
				'Current password does not match',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	public async forcePasswordReset(force: boolean) {
		const user = (
			await db
				.update(userTable)
				.set({ forcePasswordChange: force })
				.where(eq(userTable.id, this._userId))
				.returning()
		)[0];

		// Modify device sessions to have pendingPasswordReset
		const sessions = await db
			.select({
				id: deviceTable.sessionId,
			})
			.from(deviceTable)
			.where(
				and(
					eq(deviceTable.userId, this._userId),
					eq(deviceTable.status, 'active')
				)
			);

		console.log(sessions);

		for (const session of sessions) {
			const sessionKey = `session:${session.id}`;

			await redisClient.hset(sessionKey, {
				pendingPasswordReset: user.forcePasswordChange,
			});

			console.log(await redisClient.hgetall(sessionKey));
		}
	}

	public async delete() {
		const result = (
			await db
				.delete(userTable)
				.where(eq(userTable.id, this._userId))
				.returning({ id: userTable.id })
		)[0];

		return result;
	}

	public async updateRoles({ roles }: { roles: UUID[] }) {
		await db.transaction(async (tx) => {
			const current = await tx
				.select({
					roleId: userRoleTable.roleId,
				})
				.from(userRoleTable)
				.where(eq(userRoleTable.userId, this._userId));

			const toAdd = roles.filter((roleId) => !current.includes({ roleId }));
			const toRemove = current.filter(({ roleId }) => !roles.includes(roleId));

			if (toAdd.length > 0) {
				await tx
					.insert(userRoleTable)
					.values(
						toAdd.map((roleId) => ({
							roleId: roleId,
							userId: this._userId,
						}))
					)
					.onConflictDoNothing();
			}

			if (toRemove.length > 0) {
				await tx
					.delete(userRoleTable)
					.where(
						or(
							...toRemove.map(({ roleId }) => eq(userRoleTable.roleId, roleId))
						)
					);
			}
		});

		const results = await db
			.select(getTableColumns(roleTable))
			.from(roleTable)
			.innerJoin(userRoleTable, eq(userRoleTable.roleId, roleTable.id))
			.where(eq(userRoleTable.userId, this._userId));
		const permissions = await db
			.select({
				...getTableColumns(permissionTable),
				roleId: rolePermissionTable.roleId,
			})
			.from(permissionTable)
			.innerJoin(
				rolePermissionTable,
				eq(rolePermissionTable.permissionId, permissionTable.id)
			)
			.where(
				or(...results.map((role) => eq(rolePermissionTable.roleId, role.id)))
			);

		return results.map((role) => ({
			...role,
			permissions: permissions
				.filter((permission) => permission.roleId === role.id)
				.map(({ roleId, ...permission }) => permission),
		}));
	}
}
