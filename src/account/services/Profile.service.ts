import { db } from '@/config/db';
import { profileTable } from '@/config/db/schema/profile.schema';
import { userTable } from '@/config/db/schema/user.schema';
import type { User } from '@/interfaces/user.interface';
import { eq, getTableColumns } from 'drizzle-orm';
import type { UUID } from 'node:crypto';
import { Profile as ProfileType } from '@/interfaces/profile.interface';
import AppError from '@/types/AppError';
import HttpStatus from '@/types/HttpStatus.enum';

export default class Profile {
  private _userId: UUID;

  constructor(userId: UUID) {
    this._userId = userId;
  }

  public async get(): Promise<Omit<User, 'passwordHash'>> {
    const { passwordHash, ...userColumns } = getTableColumns(userTable);
    const { userId, ...profileColumns } = getTableColumns(profileTable);

    const result = await db
      .select({
        ...userColumns,
        profile: profileColumns,
      })
      .from(userTable)
      .innerJoin(profileTable, eq(userTable.id, profileTable.userId))
      .where(eq(userTable.id, this._userId));

    return result[0];
  }

  public async update(
    data: Partial<Omit<typeof profileTable.$inferInsert, 'id' | 'userId'>>
  ): Promise<ProfileType> {
    const result = (
      await db
        .update(profileTable)
        .set({
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          bio: data.bio,
        })
        .where(eq(profileTable.userId, this._userId))
        .returning()
    )[0];

    return result;
  }
}
