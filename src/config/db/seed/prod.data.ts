import z from 'zod';
import env from '@/types/env';
import { profileTable } from '../schema/profile.schema';
import { userTable } from '../schema/user.schema';
import { roleTable } from '../schema/role.schema';
import { serviceTable } from '../schema/service.schema';
import { permissionTable } from '../schema/permission.schema';

const prod = {
  users: [
    {
      id: '04f83b2f-6468-4474-9002-254cd1ac47f6',
      email: env.ADMIN.EMAIL,
      emailVerified: !z.email().safeParse(env.ADMIN.EMAIL).success, // Won't work with sending password reset to email if there's not a valid email, but non-email usernames won't validate properly on that route anyways
      passwordHash: env.ADMIN.PASSWORD,
      forcePasswordChange: env.ADMIN.PASSWORD === 'admin', // force change if it's the default password
      roles: ['admin', 'user'],
    },
  ] satisfies (typeof userTable.$inferInsert & {
    roles: string[];
  })[],
  profiles: [
    {
      userId: '04f83b2f-6468-4474-9002-254cd1ac47f6',
      firstName: 'TayLab',
      lastName: 'Admin',
      displayName: 'Admin',
      username: 'admin',
    },
  ] satisfies (typeof profileTable.$inferInsert)[],
  roles: [
    {
      id: '23e28142-85b2-412a-8e20-eeed89bbfa04',
      name: 'admin',
      permissions: [
        'auth:user.read',
        'auth:user.write',
        'auth:user.read.all',
        'auth:user.write.all',
        'auth:service.read',
        'auth:service.write',
        'auth:role.read',
        'auth:role.write',
        'auth:permission.read',
        'auth:permission.write',
        'keys:key.write',
        'keys:key.read',
        'keys:service.write',
        'keys:service.read',
      ],
    },
    {
      id: 'e5075ee5-2083-4018-bd78-6e266662067d',
      name: 'user',
      permissions: ['auth:user.read', 'auth:user.write'],
      assignToNewUser: true,
    },
  ] satisfies (Omit<typeof roleTable.$inferInsert, 'isExternal'> & {
    permissions: string[];
  })[],
};

export default prod;
