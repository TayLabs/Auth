import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { timestamp } from 'drizzle-orm/pg-core';
import { UUID } from 'node:crypto';

export const linkedOAuthTable = pgTable('linked_oauth', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.$type<UUID>()
		.notNull()
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	provider: varchar('provider', { length: 128 })
		.$type<'google' | 'apple' | 'github'>()
		.notNull(),
	providerAccountId: varchar('provider_account_id', { length: 256 }).notNull(),
	providerEmail: varchar('provider_email', { length: 256 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
