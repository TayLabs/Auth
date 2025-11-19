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
	phoneNumber: varchar('phone_number', { length: 32 }).unique(),
	phone2faEnabled: boolean('phone_2fa_enabled').notNull().default(false),
	totpEnabled: boolean('totp_enabled').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	lastUsedAt: timestamp('last_used_at'),
});
