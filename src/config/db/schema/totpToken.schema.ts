import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { bytea } from './types/bytea';
import { userTable } from './user.schema';
import { UUID } from 'node:crypto';

export const totpTokenTable = pgTable('totp_tokens', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.$type<UUID>()
		.references(() => userTable.id)
		.notNull(),
	// AES-256-GCM encrypted TOTP secret
	encryptedSecret: bytea('encrypted_secret').notNull(),
	encryptionIv: bytea('encryption_iv', { length: 128 }).notNull(),
	encryptionAuthTag: bytea('encryption_auth_tag', { length: 128 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
