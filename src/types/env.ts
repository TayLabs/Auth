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
	DATABASE_URL: z.url('Must be a valid url for the database'),
	REDIS_URI: z
		.string('Must include Redis connection string (Format: "[ipaddr]:[port]")')
		.regex(/\b[\w.-]+:(\d{1,5})\b/, 'Invalid format, use "[host]:[port]"')
		.transform((str) => {
			const [host, port] = str.split(':');

			return {
				HOST: host,
				PORT: parseInt(port),
			};
		}),
	MAIL_API: z
		.string(
			'Must include Mail service connection string (Format: "[ipaddr]:[port]")'
		)
		.regex(/\b[\w.-]+:(\d{1,5})\b/, 'Invalid format, use "[host]:[port]')
		.transform((str) => {
			const [host, port] = str.split(':');

			return {
				HOST: host,
				PORT: parseInt(port),
			};
		}),
	MAIL_API_KEY: z.string('Must include api key for mail service'),
	ACCESS_TOKEN_SECRET: z
		.string('Must be a valid string of characters')
		.min(6, 'Must be at least 6 characters long')
		.max(24, 'Must be at most 24 characters long'),
	ACCESS_TOKEN_TTL: z
		.string()
		.regex(
			/^\d+(m|h)$/,
			'Must be a valid timespan in minutes or hours (suffix: m | h)'
		)
		.default('15m'),
	REFRESH_TOKEN_SECRET: z
		.string('Must be a valid string of characters')
		.min(12, 'Must be at least 12 characters long')
		.max(32, 'Must be at most 32 characters long'),
	REFRESH_TOKEN_TTL: z
		.string()
		.regex(/^\d+(h|d)$/, 'Must be a valid length of days (suffix: d)')
		.default('30d'),
	CHECK_PASSWORD_COMPLEXITY: z
		.string()
		.regex(/^(true|false)$/, 'Must be true or false')
		.transform((str) => (str === 'true' ? true : false))
		.default(false),
	TOTP_ENCRYPT_KEY: z
		.string('Must be a valid string of characters')
		.min(12, 'Must be at least 12 characters long')
		.max(32, 'Must be at most 32 characters long')
		.transform((str) => Buffer.from(str).toString('base64')),
	RESET_TOKEN_HASH_KEY: z
		.string('Must be a valid string of characters')
		.min(12, 'Must be at least 12 characters long')
		.max(32, 'Must be at most 32 characters long')
		.transform((str) => Buffer.from(str).toString('base64')),
	RESET_TOKEN_TTL: z
		.string()
		.regex(
			/^\d+(m|h)$/,
			'Must be a valid timespan in minutes or hours (suffix: m | h)'
		)
		.default('15m'),
	EMAIL_VERIFICATION_SECRET: z
		.string('Must be a valid string of characters')
		.min(6, 'Must be at least 6 characters long')
		.max(24, 'Must be at most 24 characters long'),
	EMAIL_VERIFICATION_TTL: z
		.string()
		.regex(
			/^\d+(m|h)$/,
			'Must be a valid timespan in minutes or hours (suffix: m | h)'
		)
		.default('10m'),
	FRONTEND_URL: z.url('Please include a front-end url for use in redirects'),
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
