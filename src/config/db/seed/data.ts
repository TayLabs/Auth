import * as schema from '../schema/index.schema';

export const users = [
  {
    id: '04f83b2f-6468-4474-9002-254cd1ac47f6',
    email: 'john.doe@taylorkelley.dev',
    passwordHash: 'Password123!',
    twoFactorEnabled: false,
  },
] satisfies (typeof schema.userTable.$inferInsert)[];

export const profiles = [
  {
    userId: users[0].id,
    firstName: 'John',
    lastName: 'Doe',
    username: 'john.doe27',
  },
] satisfies (typeof schema.profileTable.$inferInsert)[];
