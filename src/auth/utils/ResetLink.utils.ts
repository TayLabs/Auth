import { db } from '@/config/db';
import { passwordResetTable, userTable } from '@/config/db/schema/index.schema';
import AppError from '@/types/AppError';
import env from '@/types/env';
import HttpStatus from '@/types/HttpStatus.enum';
import { eq } from 'drizzle-orm';
import crypto, { type UUID } from 'node:crypto';
import parseTTL from './parseTTL.utils';

export default class ResetLink {
	public static async create(email: string) {
		const token = crypto.randomBytes(32).toString('hex'); // 32 characters long

		const tokenHash = await crypto
			.createHmac('sha256', env.RESET_TOKEN_HASH_KEY)
			.update(token)
			.digest();

		// Insert to DB for user
		const user = (
			await db
				.select({ id: userTable.id })
				.from(userTable)
				.where(eq(userTable.email, email))
		)?.[0];

		if (!user)
			throw new AppError('Invalid email address', HttpStatus.NOT_FOUND);

		await db.insert(passwordResetTable).values({
			userId: user.id,
			tokenHash,
		});

		return { token, userId: user.id };
	}

	public static async verify(token: string) {
		const tokenHash = await crypto
			.createHmac('sha256', env.RESET_TOKEN_HASH_KEY)
			.update(token)
			.digest();

		const result = (
			await db
				.select({
					id: passwordResetTable.id,
					userId: passwordResetTable.userId,
					createdAt: passwordResetTable.createdAt,
				})
				.from(passwordResetTable)
				.where(eq(passwordResetTable.tokenHash, tokenHash))
		)[0];

		// Clear token if used or expired
		if (result?.id) {
			await db
				.delete(passwordResetTable)
				.where(eq(passwordResetTable.id, result?.id));
		}

		// Check if token is valid or expired
		if (
			!result ||
			result.createdAt.getTime() + parseTTL(env.RESET_TOKEN_TTL).seconds >=
				Date.now()
		) {
			throw new AppError('Invalid reset token', HttpStatus.NOT_FOUND);
		}

		return { userId: result.userId };
	}
}
