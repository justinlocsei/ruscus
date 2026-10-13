import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    chaiConfig: { truncateThreshold: 0 },
    environment: 'node',
    projects: [
      {
        test: {
          include: ['src/**/*.test.ts'],
          name: 'unit'
        }
      },
      {
        test: {
          include: ['tests/**/*.test.ts'],
          name: 'integration'
        }
      }
    ]
  }
});
