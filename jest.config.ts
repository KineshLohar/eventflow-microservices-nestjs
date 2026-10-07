// jest.config.ts (Root)
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', // Pointing to root to capture apps and libs
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'apps/**/*.(t|j)s',
    'libs/**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/main.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  // Crucial for resolving shared libraries across your microservices
  moduleNameMapper: {
    '^@app/common(|/.*)$': '<rootDir>/libs/common/src/$1',
    '^@app/database(|/.*)$': '<rootDir>/libs/database/src/$1',
  },
};

export default config;
