import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { timestamp } from 'drizzle-orm/pg-core';
import { UUID } from 'node:crypto';

export const profileTable = pgTable('profiles', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	username: varchar('username', { length: 256 }).notNull().unique(),
	firstName: varchar('first_name', { length: 128 }).notNull(),
	lastName: varchar('last_name', { length: 128 }).notNull(),
	avatarUrl: varchar('avatar_url', { length: 1024 }),
	bio: varchar('bio', { length: 512 }),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
