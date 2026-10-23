import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { runnerImport } from 'vite';

import { extractBuildPlan } from '../internal.ts';
import type { NamingScheme } from '../naming.ts';
import { ComponentRegistry } from './registry.ts';
import {
  cssToLoader,
  cssToSource,
  injectCSSImport,
  mayContainStyles,
  VIRTUAL
} from './transform.ts';

// A query string used to identify Ruscus style providers
const STYLE_QUERY = '?ruscus-styles';

/**
 * The result of loading a module
 */
type ModuleValue = {
  default?: unknown;
};

/**
 * Define the Vite plugin
 */
export function plugin(options: { naming?: NamingScheme } = {}): Plugin {
  const owners = new ComponentRegistry();

  let config: ResolvedConfig;
  let server: ViteDevServer | undefined;
  let naming: NamingScheme = options.naming ?? 'compact';

  // Infer an appropriate naming scheme after a change if no scheme was provided
  function refreshNaming(after: () => void): void {
    after();

    if (!options.naming) {
      naming = (server || config?.command === 'serve')
        ? 'verbose'
        : 'compact';
    }
  }

  // Load a source module
  async function loadSource(id: string): Promise<ModuleValue> {
    const path = `${id}${STYLE_QUERY}`;

    if (server !== undefined) {
      return server.ssrLoadModule(path);
    }

    return (
      await runnerImport<ModuleValue>(path, {
        configFile: false,
        root: config.root
      })
    ).module;
  }

  return {
    buildStart() {
      owners.clear();
    },

    configResolved(resolved) {
      refreshNaming(() => config = resolved);
    },

    configureServer(devServer) {
      refreshNaming(() => server = devServer);
    },

    handleHotUpdate({ file, server }) {
      owners.release(file);

      for (const module of server.moduleGraph.getModulesByFile(file) ?? []) {
        server.moduleGraph.invalidateModule(module);
      }
    },

    async load(id) {
      const sourceID = cssToSource(id);

      if (sourceID === undefined) {
        return null;
      }

      const module = await loadSource(sourceID);
      const plan = extractBuildPlan(module.default);

      if (plan === undefined) {
        throw new Error(`${sourceID} must export a valid Ruscus component.`);
      }

      owners.claim(plan.component.id, sourceID);

      return {
        code: plan.compile({ naming }),
        moduleType: 'css',
        moduleSideEffects: true
      };
    },

    name: 'ruscus',

    resolveId(id) {
      return cssToLoader(id) ?? null;
    },

    transform(code, id) {
      if (
        id.includes(STYLE_QUERY)
        || id.startsWith(VIRTUAL)
        || !mayContainStyles(code)
      ) {
        return null;
      }

      return {
        code: injectCSSImport(code, id),
        map: null
      };
    }
  };
}
