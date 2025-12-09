import { db } from '@/config/db';
import { profileTable } from '@/config/db/schema/profile.schema';
import { eq } from 'drizzle-orm';
import type { UUID } from 'node:crypto';

export default class Profile {
  private _userId: UUID;

  constructor(userId: UUID) {
    this._userId = userId;
  }

  public async update(
    data: Partial<Omit<typeof profileTable.$inferInsert, 'id' | 'userId'>>
  ) {
    const result = (
      await db
        .update(profileTable)
        .set(data)
        .where(eq(profileTable.userId, this._userId))
        .returning()
    )[0];

    return result;
  }
}
