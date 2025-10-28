module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@supabase|@tanstack|react-native-chart-kit)/)',
  ],
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@screens(.*)$': '<rootDir>/src/screens$1',
    '^@navigation(.*)$': '<rootDir>/src/navigation$1',
    '^@context(.*)$': '<rootDir>/src/context$1',
    '^@hooks(.*)$': '<rootDir>/src/hooks$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@theme(.*)$': '<rootDir>/src/theme$1',
    '^@types(.*)$': '<rootDir>/src/types$1',
    '^@lib(.*)$': '<rootDir>/src/lib$1',
    '^@assets(.*)$': '<rootDir>/src/assets$1',
    '^@animations(.*)$': '<rootDir>/src/animations$1',
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};

