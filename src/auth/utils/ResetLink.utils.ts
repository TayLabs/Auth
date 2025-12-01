import { db } from '@/config/db';
import { passwordResetTable, userTable } from '@/config/db/schema/index.schema';
import AppError from '@/types/AppError';
import env from '@/types/env';
import HttpStatus from '@/types/HttpStatus.enum';
import { eq } from 'drizzle-orm';
import crypto, { type UUID } from 'node:crypto';

export default class ResetLink {
  public static async create(email: string) {
    const token = crypto.randomBytes(32).toString('utf-8'); // 32 characters long

    const tokenHash = await crypto
      .createHmac('sha256', env.RESET_TOKEN_HASH_KEY)
      .update(token)
      .digest();

    // Insert to DB for user
    const { id: userId } = (
      await db
        .select({ id: userTable.id })
        .from(userTable)
        .where(eq(userTable.email, email))
    )?.[0];

    if (!userId)
      throw new AppError('Invalid email address', HttpStatus.NOT_FOUND);

    await db.insert(passwordResetTable).values({
      userId,
      tokenHash,
    });

    return { token, userId };
  }

  public static async verify(token: string) {
    const tokenHash = await crypto
      .createHmac('sha256', env.RESET_TOKEN_HASH_KEY)
      .update(token)
      .digest();

    const result = (
      await db
        .select({ userId: passwordResetTable.userId })
        .from(passwordResetTable)
        .where(eq(passwordResetTable.tokenHash, tokenHash))
    )[0];

    if (!result) {
      throw new AppError('Invalid reset token', HttpStatus.NOT_FOUND);
    }

    return { userId: result.userId };
  }
}
