import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.schema';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
	max: 1,
});
pool.on('connect', () => {
	console.log('🔌 Database connection established successfully.');
});
pool.on('error', (err) => {
	console.error('🛑 Database connection test failed:', err);
	process.exit(1);
});

const db = drizzle({ client: pool, schema });

export { db };
