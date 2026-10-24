import {
  createServer,
  type HmrContext,
  type Plugin,
  type ViteDevServer
} from 'vite';
import { assert, describe, it } from 'vitest';

import ruscus from '../../src/vite.ts';
import type { PluginOptions } from '../../src/vite/plugin.ts';
import { sourceToCSS } from '../../src/vite/transform.ts';

const ROOT = new URL('./fixtures/', import.meta.url);
const CARD = new URL('./fixtures/card.ts', import.meta.url).pathname;

type Actions = {
  handleHotUpdate: (context: HmrContext) => void | Promise<void>;
  load: (id: string) => Promise<{ code?: string } | null>;
  resolveId: (id: string) => string | null;
};

function testPlugin(options?: PluginOptions): {
  actions: Actions;
  plugin: Plugin;
} {
  const plugin = ruscus(options);

  return {
    actions: plugin as unknown as Actions,
    plugin
  };
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
    const { actions: hooks, plugin } = testPlugin();

    await withServer(plugin, async () => {
      const result = await hooks.load(sourceToCSS(CARD));

      assert.include(String(result?.code), '.card {');
    });
  });

  it('respects an explicit naming scheme', async () => {
    const { actions: hooks, plugin } = testPlugin({ naming: 'compact' });

    await withServer(plugin, async () => {
      const result = await hooks.load(sourceToCSS(CARD));
      const code = String(result?.code);

      assert.include(code, 'color: red;');
      assert.notInclude(code, '.card {');
    });
  });

  it('ignores IDs that are not Ruscus CSS modules', () => {
    assert.isNull(testPlugin().actions.resolveId('/styles/not-css.ts'));
  });

  it('invalidates modules when a style file changes', async () => {
    const { actions: hooks, plugin } = testPlugin();
    const invalidated: string[] = [];

    await withServer(plugin, async () => {
      const devServer = {
        moduleGraph: {
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

      assert.deepEqual(invalidated, ['/entry.ts']);
    });
  });

  it('ignores hot updates for files outside the module graph', async () => {
    const { actions: hooks, plugin } = testPlugin();

    await withServer(plugin, async () => {
      await hooks.handleHotUpdate({
        file: CARD,
        modules: [],
        read: async () => '',
        server: {
          moduleGraph: {
            getModulesByFile: () => undefined,
            invalidateModule: () => undefined
          }
        } as unknown as ViteDevServer,
        timestamp: Date.now()
      } as HmrContext);
    });
  });
});
