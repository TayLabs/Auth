import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { type UUID } from 'node:crypto';

export const permissionTable = pgTable('permissions', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	assignToNewRole: boolean('assign_to_new_role').default(false),
});
