import { varchar } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 256 }).notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	passwordHash: varchar('password_hash', { length: 512 }).notNull(),
});
