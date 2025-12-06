import { pgTable, unique } from 'drizzle-orm/pg-core';
import { permissionTable } from './permission.schema';
import { roleTable } from './role.schema';
import { uuid } from 'drizzle-orm/pg-core';
import { type UUID } from 'node:crypto';

export const rolePermissionTable = pgTable(
	'role_permission',
	{
		id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
		roleId: uuid('role_id')
			.$type<UUID>()
			.references(() => roleTable.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		permissionId: uuid('permission_id')
			.$type<UUID>()
			.references(() => permissionTable.id, {
				onDelete: 'cascade',
			})
			.notNull(),
	},
	(rolePermission) => [
		// Do not allow duplicate permissions for a single role
		unique('rolePermissionConstraint').on(
			rolePermission.roleId,
			rolePermission.permissionId
		),
	]
);
