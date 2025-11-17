import {
	pgTable,
	uuid,
	timestamp,
	varchar,
	boolean,
	check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { totpTokenTable } from './totpToken.schema';
import { linkedOAuthTable } from './linkedOAuth.schema';

export const userTable = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 256 }).unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	passwordHash: varchar('password_hash', { length: 512 }),
	phoneNumber: varchar('phone_number', { length: 32 }).unique(),
	phone2faEnabled: boolean('phone_2fa_enabled').notNull().default(false),
	totpEnabled: boolean('totp_enabled').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	lastUsedAt: timestamp('last_used_at'),
});
