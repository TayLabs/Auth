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
			service: 'auth',
			permissions: [
				'user.read',
				'user.write',
				'service.read',
				'service.write',
				'role.read',
				'role.write',
				'permission.read',
				'permission.write',
				'keys.write',
			],
		},
		{
			id: 'e5075ee5-2083-4018-bd78-6e266662067d',
			service: 'auth',
			name: 'user',
			permissions: ['user.read', 'user.write'],
			assignToNewUser: true,
		},
	] satisfies (Omit<typeof roleTable.$inferInsert, 'serviceId'> & {
		service: string;
		permissions: string[];
	})[],
};

export default prod;
