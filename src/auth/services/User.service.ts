import { db } from '@/config/db';
import { userTable } from '@/config/db/schema/user.schema';
import { eq, DrizzleQueryError, getTableColumns } from 'drizzle-orm';
import { DatabaseError } from 'pg';
import Password from '../utils/Password.util';
import { profileTable } from '@/config/db/schema/profile.schema';
import type { User as UserType } from '@/auth/interfaces/user.interface';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';

const { passwordHash: _passwordHash, ...userColumns } =
	getTableColumns(userTable);
const { userId: _userId, ...profileColumns } = getTableColumns(profileTable);

export default class User {
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
}
