import { unique, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import type { UUID } from 'node:crypto';
import { userTable } from './user.schema';
import { roleTable } from './role.schema';

export const userRoleTable = pgTable(
  'user_role',
  {
    id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .$type<UUID>()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    roleId: uuid('role_id')
      .$type<UUID>()
      .references(() => roleTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
  },
  (table) => [
    unique('user_role_unique_constraint').on(table.userId, table.roleId),
  ]
);
