import z from 'zod';
import dotenv from 'dotenv';

// Only load .env files with 'dotenv' if in development mode
if (process.env.NODE_ENV === 'development') {
	dotenv.config({ path: '.env', quiet: true });
	dotenv.config({
		path: '.env.local',
		override: true,
		quiet: true, // Disable logs/tips
	});
}

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'], {
			error: 'Must be set to development, production, or test',
		})
		.default('production'),
	PORT: z
		.string()
		.regex(/^\d+$/, 'Not a valid number')
		.default('7313')
		.transform(Number),
	DATABASE_URL: z.url('Please include a valid url for the database'),
	CHECK_PASSWORD_COMPLEXITY: z
		.string()
		.regex(/^(true|false)$/, 'Must be true or false')
		.transform((str) => (str === 'true' ? true : false))
		.default(false),
	SESSION_SECRET: z
		.string('Please include a valid string of characters')
		.min(12, 'Must be at least 12 characters long'),
});
type EnvVariables = z.infer<typeof envSchema>;

let env: EnvVariables;
try {
	env = envSchema.parse(process.env);
} catch (error) {
	if (error instanceof z.ZodError) {
		const errorTree = z.treeifyError<EnvVariables>(
			error as z.ZodError<EnvVariables>
		).properties;

		console.error(
			'❌ Invalid environment variables:',
			errorTree &&
				Object.entries(errorTree).map(
					([key, value]) => `${key}: ${value.errors.join(', ')}`
				)
		);
		process.exit(1);
	}
	throw error;
}

export { env as default, type EnvVariables };
