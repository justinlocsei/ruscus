import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    chaiConfig: { truncateThreshold: 0 },
    coverage: {
      exclude: ['src/**/*.test.ts'],
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
    include: ['src/**/*.test.ts']
  }
});
