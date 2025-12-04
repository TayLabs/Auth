import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index.schema';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
	max: 1,
});

const initializeDatabase = () => {
	const db = drizzle({ client: pool, schema });

	// Optionally test the connection
	// await
	pool
		.query('SELECT 1')
		.then(() => {
			console.log('🔌 Database connection established successfully.');
		})
		.catch((err) => {
			console.error('🛑 Database connection test failed:', err);
			process.exit(1);
		});

	return db;
};

export const db = initializeDatabase();
