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
	PORT: z.coerce.number<Number>().default(7313),
});

try {
	envSchema.parse(process.env);
} catch (error) {
	if (error instanceof z.ZodError) {
		const errorTree = z.treeifyError<z.infer<typeof envSchema>>(
			error as z.ZodError<z.infer<typeof envSchema>>
		).properties;

		console.error(
			'❌ Invalid environment variables:',
			errorTree
				? Object.entries(errorTree).map(
						([key, value]) => `${key}: ${value.errors.join(', ')}`
				  )
				: 'unknown error'
		);
		process.exit(1);
	}
	throw error;
}

export type EnvSchema = z.infer<typeof envSchema>;
