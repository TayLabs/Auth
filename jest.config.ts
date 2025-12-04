import { register } from 'tsconfig-paths';
register();

import type { JestConfigWithTsJest } from 'ts-jest';

export default {
	clearMocks: true,
	coverageProvider: 'v8',
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},

	globalSetup: '<rootDir>/src/config/jest/jest.setup.ts',
	globalTeardown: '<rootDir>/src/config/jest/jest.teardown.ts',

	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
} as JestConfigWithTsJest;
