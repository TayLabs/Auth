import {
	jsonb,
	timestamp,
	uuid,
	varchar,
	pgTable,
	unique,
} from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import type { DeviceType, IPAddress } from '@/types/DeviceType';
import { type UUID } from 'node:crypto';

export type DeviceMetadata = {
	ipAddress: IPAddress;
	deviceType: DeviceType;
	browser?: string;
	version?: string;
	os?: string;
	platform?: string;
	source?: string; // UserAgent string
};

export const deviceTable = pgTable(
	'devices',
	{
		id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.$type<UUID>()
			.references(() => userTable.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		sessionId: varchar('session_id', { length: 32 }).notNull(),
		deviceId: uuid('device_id').$type<UUID>().notNull().defaultRandom(),
		device: jsonb('device').$type<DeviceMetadata>().notNull(),
		status: varchar('status', { length: 32 })
			.$type<'active' | 'inactive' | 'revoked'>()
			.notNull()
			.default('active'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => [
		unique('unique_user_id_and_device_id').on(table.userId, table.deviceId),
	]
);
