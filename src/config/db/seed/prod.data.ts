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
			roles: ['admin'],
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
	services: [
		{
			id: 'b6d842b8-91be-46f7-a340-c4afb1b63a0b',
			name: 'auth',
		},
	] satisfies (typeof serviceTable.$inferInsert)[],
	roles: [
		{
			name: 'admin',
		},
		{
			name: 'user',
			assignToNewUser: true,
		},
	] satisfies (typeof roleTable.$inferInsert)[],
	permissions: [
		{
			serviceId: 'b6d842b8-91be-46f7-a340-c4afb1b63a0b',
			resource: 'user',
			action: 'read',
			roles: ['auth'],
		},
		{
			serviceId: 'b6d842b8-91be-46f7-a340-c4afb1b63a0b',
			resource: 'user',
			action: 'write',
			roles: ['auth'],
		},
	] satisfies (typeof permissionTable.$inferInsert & {
		roles: string[];
	})[],
};

export default prod;
