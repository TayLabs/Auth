import { pgTable, varchar, boolean, uuid, unique } from 'drizzle-orm/pg-core';
import { type UUID } from 'node:crypto';
import { serviceTable } from './service.schema';

export const roleTable = pgTable(
	'roles',
	{
		id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
		serviceId: uuid('service_id')
			.$type<UUID>()
			.references(() => serviceTable.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade',
			})
			.notNull(),
		name: varchar('name', { length: 128 }).notNull(),
		assignToNewUser: boolean('assign_to_new_user').notNull().default(false),
	},
	(table) => [
		unique('service_name_unique_constraint').on(table.serviceId, table.name),
	]
);
