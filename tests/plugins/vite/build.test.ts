import { build as viteBuild } from 'vite';
import { assert, describe, it } from 'vitest';

import ruscus from '../../../src/plugins/vite.ts';

const ROOT = new URL('./fixtures/', import.meta.url);

function build(
  entry: string,
  {
    cssCodeSplit,
    outDir,
    write = false
  }: {
    cssCodeSplit?: boolean;
    outDir?: string;
    write?: boolean;
  } = {}
) {
  return viteBuild({
    build: {
      cssCodeSplit,
      lib: {
        entry: new URL(`./${entry}.ts`, ROOT).pathname,
        fileName: 'bundle',
        formats: ['es']
      },
      outDir,
      write
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

function extractJS(result: Awaited<ReturnType<typeof build>>) {
  const outputs = Array.isArray(result) ? result : [result];

  return outputs
    .filter(o => 'output' in o)
    .flatMap(o => o.output)
    .filter(i => i.type === 'chunk')
    .map(i => i.type === 'chunk' ? i.code : '')
    .join('\n');
}

describe('Vite build', () => {
  it('emits CSS for reachable applied components', async () => {
    const result = await build('card.styles');
    const css = extractCSS(result);
    const js = extractJS(result);

    assert.match(css, /color:\s*red/);
    assert.notInclude(css, '.card {');
    assert.notInclude(css, '.unused');
    assert.match(js, /virtual:ruscus\/config/);
  });

  it('keeps CSS reachable through a dynamically imported chunk', async () => {
    const css = extractCSS(
      await build('chunk-entry', { cssCodeSplit: true })
    );

    assert.match(css, /color:\s*green/);
    assert.notInclude(css, '.lazy {');
  });
});
