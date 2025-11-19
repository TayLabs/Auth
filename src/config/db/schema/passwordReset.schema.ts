import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { bytea } from './types/bytea';
import { UUID } from 'node:crypto';

export const passwordResetTable = pgTable('password_resets', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.$type<UUID>()
		.references(() => userTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		})
		.notNull(),
	tokenHash: bytea('token_hash').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
