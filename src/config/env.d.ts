import { type EnvSchema } from '@/config/env';

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvSchema {}
	}
}

export {};
