import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { timestamp } from 'drizzle-orm/pg-core';

export const profileTable = pgTable('profiles', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => userTable.id)
		.notNull(),
	username: varchar('username', { length: 256 }).notNull().unique(),
	firstName: varchar('first_name', { length: 128 }).notNull(),
	lastName: varchar('last_name', { length: 128 }).notNull(),
	bio: varchar('bio', { length: 512 }),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
