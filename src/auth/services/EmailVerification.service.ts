import { db } from '@/config/db';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { userTable } from '@/config/db/schema/user.schema';
import env from '@/types/env';
import parseTTL from '../utils/parseTTL.utils';
import { eq } from 'drizzle-orm';
import type { UUID } from 'node:crypto';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';

export default class EmailVerification {
	public static async create(
		userId: UUID
	): Promise<{ token: string; email: string }> {
		const token = await jwt.sign(
			{
				userId,
			},
			env.EMAIL_VERIFICATION_SECRET,
			{
				expiresIn: parseTTL(env.EMAIL_VERIFICATION_TTL).seconds,
			}
		);

		const user = (
			await db
				.select({ email: userTable.email })
				.from(userTable)
				.where(eq(userTable.id, userId))
		)[0]!;

		// Implementation for creating an email verification token
		return { token, email: user.email };
	}

	public static async verify(token: string) {
		try {
			const { userId } = jwt.verify(token, env.EMAIL_VERIFICATION_SECRET) as {
				userId: UUID;
			};

			// Mark email as verified in db
			await db
				.update(userTable)
				.set({
					emailVerified: true,
				})
				.where(eq(userTable.id, userId));
		} catch (error) {
			if (error instanceof JsonWebTokenError) {
				throw new AppError('Missing or invalid token', HttpStatus.BAD_REQUEST);
			} else if (error instanceof TokenExpiredError) {
				throw new AppError('Token has expired', HttpStatus.UNAUTHORIZED);
			} else {
				throw new AppError(
					'An unexpected error occurred, try again later',
					500
				);
			}
		}
	}
}
