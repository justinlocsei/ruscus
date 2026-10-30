import {
  createServer,
  type HmrContext,
  type Plugin,
  type ViteDevServer
} from 'vite';
import { assert, describe, it } from 'vitest';

import ruscus from '../../../src/plugins/vite.ts';
import type { PluginOptions } from '../../../src/plugins/shared.ts';
import {
  getInternalCSSModuleID,
  getCSSModuleID
} from '../../../src/plugins/vite/transform.ts';

const ROOT = new URL('./fixtures/', import.meta.url);

const fixture = (name: string) =>
  new URL(`./fixtures/${name}.ts`, import.meta.url).pathname;

const CARD = fixture('card.styles');
const CARD_TOKENS = fixture('card-tokens.styles');
const TOKENS = fixture('tokens');

const resolve = (id: string) =>
  getInternalCSSModuleID(getCSSModuleID(id)) ?? '';

const CARD_CSS = resolve(CARD);
const CARD_TOKENS_CSS = resolve(CARD_TOKENS);

type PluginTestAPI = {
  handleHotUpdate: (context: HmrContext) => unknown;
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

  it('invalidates CSS when a style dependency changes', async () => {
    const plugin = testPlugin();
    const hooks = asTestAPI(plugin);
    const invalidated: string[] = [];

    await withServer(plugin, async (server) => {
      await server.transformRequest(CARD_TOKENS);
      await server.pluginContainer.load(CARD_TOKENS_CSS);

      const graph = server.moduleGraph;
      const modules = [...graph.getModulesByFile(TOKENS) ?? []];

      assert.isNotEmpty(modules);

      const invalidateModule = graph.invalidateModule.bind(graph);

      graph.invalidateModule = (node, seen) => {
        invalidated.push(node.id ?? '');
        return invalidateModule(node, seen);
      };

      await hooks.handleHotUpdate({
        file: TOKENS,
        modules,
        read: async () => '',
        server,
        timestamp: Date.now()
      } as HmrContext);

      assert.include(invalidated, CARD_TOKENS_CSS);
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
});
