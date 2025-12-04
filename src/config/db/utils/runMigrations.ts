import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '..';
import path from 'node:path';

export default async function runMigrations() {
  console.log('Running database migrations');

  const migrationsFolder = path.join(__dirname, '../migrations');
  await migrate(db, { migrationsFolder });

  console.log('Migrations complete');
}
