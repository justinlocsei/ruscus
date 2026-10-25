import {
  createServer,
  type HmrContext,
  type Plugin,
  type ViteDevServer
} from 'vite';
import { assert, describe, it } from 'vitest';

import ruscus from '../../src/vite.ts';
import type { PluginOptions } from '../../src/vite/plugin.ts';
import { cssToLoader, sourceToCSS } from '../../src/vite/transform.ts';

const ROOT = new URL('./fixtures/', import.meta.url);
const CARD = new URL('./fixtures/card.ts', import.meta.url).pathname;
const CARD_CSS = cssToLoader(sourceToCSS(CARD)) ?? '';

type PluginTestAPI = {
  handleHotUpdate: (context: HmrContext) => unknown;
  resolveId: (id: string) => string | null;
};

function testPlugin(options?: PluginOptions): Plugin {
  return ruscus(options);
}

function asTestAPI(plugin: Plugin): PluginTestAPI {
  return plugin as unknown as PluginTestAPI;
}

function loadCode(result: unknown): string {
  if (result === undefined || result === null) {
    return '';
  } else if (typeof result === 'string') {
    return result;
  } else if (typeof result === 'object' && 'code' in result) {
    return String(result.code ?? '');
  } else {
    return '';
  }
}

async function withServer(
  plugin: Plugin,
  useServer: (server: ViteDevServer) => Promise<void>
) {
  const server = await createServer({
    logLevel: 'silent',
    plugins: [plugin],
    root: ROOT.pathname
  });

  try {
    await useServer(server);
  } finally {
    await server.close();
  }
}

describe('Vite develop', () => {
  it('compiles reachable styles with verbose naming', async () => {
    const plugin = testPlugin();

    await withServer(plugin, async (server) => {
      const result = await server.pluginContainer.load(CARD_CSS);

      assert.include(loadCode(result), '.card {');
    });
  });

  it('respects an explicit naming scheme', async () => {
    const plugin = testPlugin({ naming: 'compact' });

    await withServer(plugin, async (server) => {
      const code = loadCode(await server.pluginContainer.load(CARD_CSS));

      assert.include(code, 'color: red;');
      assert.notInclude(code, '.card {');
    });
  });

  it('ignores IDs that are not Ruscus CSS modules', () => {
    assert.isNull(asTestAPI(testPlugin()).resolveId('/styles/not-css.ts'));
  });

  it('invalidates modules when a style file changes', async () => {
    const plugin = testPlugin();
    const hooks = asTestAPI(plugin);
    const invalidated: string[] = [];

    await withServer(plugin, async () => {
      const devServer = {
        moduleGraph: {
          getModuleById: (id: string) => (
            id === CARD_CSS ? { id: CARD_CSS } : undefined
          ),
          getModulesByFile: () => new Set([{ id: '/entry.ts' }]),
          invalidateModule: ({ id }: { id: string | null }) => {
            invalidated.push(id ?? '');
          }
        }
      } as unknown as ViteDevServer;

      await hooks.handleHotUpdate({
        file: CARD,
        modules: [],
        read: async () => '',
        server: devServer,
        timestamp: Date.now()
      } as HmrContext);

      assert.deepEqual(invalidated, ['/entry.ts', CARD_CSS]);
    });
  });

  it('ignores hot updates for files outside the module graph', async () => {
    const plugin = testPlugin();
    const hooks = asTestAPI(plugin);

    await withServer(plugin, async () => {
      await hooks.handleHotUpdate({
        file: CARD,
        modules: [],
        read: async () => '',
        server: {
          moduleGraph: {
            getModuleById: () => undefined,
            getModulesByFile: () => undefined,
            invalidateModule: () => undefined
          }
        } as unknown as ViteDevServer,
        timestamp: Date.now()
      } as HmrContext);
    });
  });
});
