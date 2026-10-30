import { build as viteBuild } from 'vite';
import { assert, describe, it } from 'vitest';

import ruscus from '../../src/vite.ts';

const ROOT = new URL('./fixtures/', import.meta.url);

function build(
  entry: string,
  { cssCodeSplit }: { cssCodeSplit?: boolean } = {}
) {
  return viteBuild({
    build: {
      cssCodeSplit,
      lib: {
        entry: new URL(`./${entry}.ts`, ROOT).pathname,
        formats: ['es']
      },
      write: false
    },
    logLevel: 'silent',
    plugins: [ruscus()],
    root: ROOT.pathname
  });
}

function extractCSS(result: Awaited<ReturnType<typeof build>>) {
  const outputs = Array.isArray(result) ? result : [result];

  return outputs
    .filter(o => 'output' in o)
    .flatMap(o => o.output)
    .filter(i => i.type === 'asset' && i.fileName.endsWith('.css'))
    .map(i => i.type === 'asset' ? String(i.source) : '')
    .join('\n');
}

describe('Vite build', () => {
  it('emits CSS for reachable applied components', async () => {
    const css = extractCSS(await build('card'));

    assert.match(css, /color:\s*red/);
    assert.notMatch(css, /\.card\s*\{/);
    assert.notInclude(css, '.unused');
  });

  it('keeps CSS reachable through a dynamically imported chunk', async () => {
    const css = extractCSS(
      await build('chunk-entry', { cssCodeSplit: true })
    );

    assert.match(css, /color:\s*green/);
    assert.notMatch(css, /\.lazy\s*\{/);
  });
});
