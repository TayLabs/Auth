import type { Config } from 'jest';

export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/*.e2e-spec.ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/../src/$1', // Maps @/ to ../src folder when importing app.ts in tests
	},
	globalSetup: '<rootDir>/setup.ts',
	globalTeardown: '<rootDir>/teardown.ts',
} satisfies Config;
