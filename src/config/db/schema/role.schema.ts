import { pgTable, varchar, boolean, uuid } from 'drizzle-orm/pg-core';
import { type UUID } from 'node:crypto';

export const roleTable = pgTable('roles', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
	name: varchar('name', { length: 128 }).notNull().unique(),
	assignToNewUser: boolean('assign_to_new_user').default(false),
});
