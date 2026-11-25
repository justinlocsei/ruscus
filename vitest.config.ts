import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    chaiConfig: { truncateThreshold: 0 },
    coverage: {
      exclude: [
        'src/**/*.test.ts',
        'src/tests.ts',
        'src/tests/**',
        'src/plugins/**'
      ],
      include: ['src/**/*.ts'],
      provider: 'v8',
      reporter: ['html', 'text'],
      skipFull: true,
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    environment: 'node',
    projects: [
      {
        test: {
          exclude: ['src/**/*.prop.test.ts'],
          include: ['src/**/*.test.ts'],
          name: 'unit'
        }
      },
      {
        test: {
          include: ['tests/**/*.test.ts'],
          name: 'integration'
        }
      },
      {
        test: {
          include: ['src/**/*.prop.test.ts', 'tests/**/*.prop.test.ts'],
          name: 'properties',
          setupFiles: ['./test/setup/properties.ts'],
          testTimeout: 30_000
        }
      }
    ]
  }
});
