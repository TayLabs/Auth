import env from './src/types/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/config/db/schema/index.schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
});
