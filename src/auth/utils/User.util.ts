import { db } from '@/config/db';
import { userTable } from '@/config/db/schema/user.schema';
import { eq, DrizzleQueryError, getTableColumns } from 'drizzle-orm';
import { DatabaseError } from 'pg';
import { type UUID } from 'node:crypto';
import { hashPasswordAsync } from './Password.util';
import { profileTable } from '@/config/db/schema/profile.schema';

const { passwordHash: _passwordHash, ...userColumns } =
  getTableColumns(userTable);
const { userId: _userId, ...profileColumns } = getTableColumns(profileTable);

export default class User {
  public static async getAsync(userId: UUID) {
    return await db.query.userTable.findFirst({
      where: (userTable) => eq(userTable.id, userId),
    });
  }

  public static async createAsync(
    email: string,
    password: string,
    { firstName, lastName }: { firstName: string; lastName: string }
  ) {
    const passwordHash = await hashPasswordAsync(password);

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
