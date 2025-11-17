import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { bytea } from './types/bytea';

export const passwordResetTable = pgTable('password_resets', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	tokenHash: bytea('token_hash').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
