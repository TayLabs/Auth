import { profileTable } from '../schema/profile.schema';
import { userTable } from '../schema/user.schema';
import { roleTable } from '../schema/role.schema';
import { type RepoConfig } from '../utils/fetchPermissions';

const test = {
	serviceConfigs: [
		{
			service: 'auth',
			permissions: [
				{ key: 'user.read', description: 'Read user data', scopes: ['user'] },
				{ key: 'user.write', description: 'Write user data', scopes: ['user'] },
				{
					key: 'user.read.all',
					description: 'Read user data',
					scopes: ['user'],
				},
				{
					key: 'user.write.all',
					description: 'Write user data',
					scopes: ['user'],
				},
				{
					key: 'service.read',
					description: 'Read all services',
					scopes: ['user'],
				},
				{
					key: 'service.write',
					description: 'Modify all services',
					scopes: ['user'],
				},
				{ key: 'role.read', description: 'Read all roles', scopes: ['user'] },
				{ key: 'role.write', description: 'Modify any role', scopes: ['user'] },
				{
					key: 'permission.read',
					description: 'Read all permissions',
					scopes: ['user'],
				},
				{
					key: 'permission.write',
					description: 'Modify all permissions',
					scopes: ['user'],
				},
			],
		},
	] satisfies RepoConfig[],

	users: [
		{
			id: '04f83b2f-6468-4474-9002-254cd1ac47f6',
			email: 'john.doe@taylorkelley.dev',
			emailVerified: true,
			passwordHash: 'Password123!',
			forcePasswordChange: false,
			roles: ['admin'],
		},
	] satisfies (typeof userTable.$inferInsert & {
		roles: string[];
	})[],

	profiles: [
		{
			userId: '04f83b2f-6468-4474-9002-254cd1ac47f6',
			firstName: 'John',
			lastName: 'Doe',
			displayName: 'John Doe',
			username: 'john.doe27',
		},
	] satisfies (typeof profileTable.$inferInsert)[],

	roles: [
		{
			id: 'e5075ee5-2083-4018-bd78-6e266662067d',
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
			],
			assignToNewUser: true,
		},
	] satisfies (Omit<typeof roleTable.$inferInsert, 'isExternal'> & {
		permissions: string[];
	})[],
};

export default test;
