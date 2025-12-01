import {
	pgTable,
	uuid,
	timestamp,
	varchar,
	boolean,
} from 'drizzle-orm/pg-core';
import { UUID } from 'node:crypto';

export const userTable = pgTable('users', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
	email: varchar('email', { length: 256 }).notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	passwordHash: varchar('password_hash', { length: 512 }).notNull(),
	forcePasswordChange: boolean('force_password_change')
		.notNull()
		.default(false),
	phoneNumber: varchar('phone_number', { length: 32 }).unique(),
	phoneTwoFactorEnabled: boolean('phone_two_factor_enabled')
		.notNull()
		.default(false),
	twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
