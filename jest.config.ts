import type { Config } from 'jest';

const config: Config = {
  projects: [
    '<rootDir>/packages/common',
    '<rootDir>/packages/database',
    '<rootDir>/packages/events',
    '<rootDir>/services/identity',
    '<rootDir>/services/company',
    '<rootDir>/services/trade-core',
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    'services/*/src/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/*.interface.ts',
    '!**/*.dto.ts',
    '!**/*.entity.ts',
    '!**/*.enum.ts',
    '!**/*.constants.ts',
    '!**/migrations/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'json-summary'],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 30000,
  verbose: true,
};

export default config;
