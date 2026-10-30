import type { ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { isRunnableDevEnvironment, runnerImport } from 'vite';
import type { ModuleRunner } from 'vite/module-runner';

import { extractBuildPlan } from '../internal.ts';
import type { NamingScheme } from '../naming.ts';
import { ComponentRegistry } from './registry.ts';
import {
  cssToLoader,
  cssToSource,
  injectCSSImport,
  mightContainStyles,
  sourceToCSS,
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
 * Plugin options
 */
export type PluginOptions = {
  naming?: NamingScheme;
};

/**
 * Define the Vite plugin
 */
export function plugin(options: PluginOptions = {}): Plugin {
  const owners = new ComponentRegistry();

  let config: ResolvedConfig;
  let moduleRunner: ModuleRunner | undefined;
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

    if (moduleRunner !== undefined) {
      return moduleRunner.import(path);
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
      moduleRunner = undefined;
      owners.clear();
    },

    configResolved(resolved) {
      refreshNaming(() => config = resolved);
    },

    configureServer(devServer) {
      refreshNaming(() => {
        server = devServer;

        const environment = devServer.environments.ssr;

        if (isRunnableDevEnvironment(environment)) {
          moduleRunner = environment.runner;
        }
      });
    },

    handleHotUpdate({ file, modules, server }) {
      owners.release(file);

      const updated = new Set<ModuleNode>();
      const graph = server.moduleGraph;

      const invalidate = (node: ModuleNode) => {
        graph.invalidateModule(node);
        updated.add(node);
      };

      const invalidateCSSForSource = (sourceID: string) => {
        const cssModule = graph.getModuleById(
          `${VIRTUAL}${sourceToCSS(sourceID)}`
        );

        if (cssModule) {
          invalidate(cssModule);
        }
      };

      const styleSourceFromModule = (node: ModuleNode): string | undefined => {
        const id = node.id ?? '';
        const fromCSS = cssToSource(id);

        if (fromCSS !== undefined) {
          return fromCSS;
        }

        if (id.includes(STYLE_QUERY)) {
          return id.slice(0, id.indexOf(STYLE_QUERY));
        }

        return node.file ?? undefined;
      };

      const touchModule = (node: ModuleNode) => {
        invalidate(node);

        const source = styleSourceFromModule(node);

        if (source !== undefined) {
          invalidateCSSForSource(source);
        }
      };

      const visited = new Set<ModuleNode>();

      const visitModule = (node: ModuleNode) => {
        if (visited.has(node)) {
          return;
        }

        visited.add(node);
        touchModule(node);

        for (const importer of node.importers) {
          visitModule(importer);
        }
      };

      for (const node of modules) {
        visitModule(node);
      }

      invalidateCSSForSource(file);

      return updated.size > 0 ? [...updated] : undefined;
    },

    async load(id) {
      const sourceID = cssToSource(id);

      if (sourceID === undefined) {
        return null;
      }

      this.addWatchFile(sourceID);

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
        || !mightContainStyles(code)
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
