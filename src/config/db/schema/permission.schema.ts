import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { type UUID } from 'node:crypto';
import { serviceTable } from './service.schema';
import { unique } from 'drizzle-orm/pg-core';

export const permissionTable = pgTable(
	'permissions',
	{
		id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
		serviceId: uuid('service_id')
			.$type<UUID>()
			.references(() => serviceTable.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		key: varchar('key', { length: 128 }).notNull(),
		description: text('description'),
	},
	(table) => [
		unique('service_resource_action_unique_constraint').on(
			table.serviceId,
			table.key
		),
	]
);
