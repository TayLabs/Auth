import type { JestConfigWithTsJest } from 'ts-jest';

export default {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  roots: ['<rootDir>/src'],

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
} as JestConfigWithTsJest;
