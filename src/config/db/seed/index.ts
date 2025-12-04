import Password from '@/auth/utils/Password.util';
import { db } from '..';
import { userTable } from '../schema/user.schema';
import { users } from './data';

export default async function seed() {
  try {
    await db.delete(userTable);

    await db.insert(userTable).values(
      await Promise.all(
        users.map(async (user) => ({
          ...user,
          passwordHash: await Password.hashAsync(user.passwordHash),
        }))
      )
    );

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error(err);
  }
}
