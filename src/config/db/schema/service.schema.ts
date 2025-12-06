import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { UUID } from 'node:crypto';

const serviceTable = pgTable('services', {
	id: uuid('id').$type<UUID>().primaryKey().defaultRandom(),
});
