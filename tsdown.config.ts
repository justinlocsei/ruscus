import type { UserConfig } from 'tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig(
  ['index', 'plugins/vite'].map((file): UserConfig => ({
    entry: `src/${file}.ts`,
    format: ['esm'],
    outputOptions: { codeSplitting: false },
    sourcemap: 'hidden'
  }))
);
