import type { ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { isRunnableDevEnvironment, runnerImport } from 'vite';
import type { ModuleRunner } from 'vite/module-runner';

import { extractBuildPlan } from '../internal.ts';
import type { NamingScheme } from '../naming.ts';
import { ComponentRegistry } from './registry.ts';
import {
  extractSourceModuleID,
  getCSSModuleID,
  getInternalCSSModuleID,
  injectCSSImport,
  mightContainStyles,
  RESOLVED
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
  //
  // If the plugin appears to be running in a development environment, this
  // uses verbose naming.  Otherwise, compact naming is used.
  function refreshNaming(after: () => void): void {
    after();

    if (!options.naming) {
      naming = (server || config?.command === 'serve')
        ? 'verbose'
        : 'compact';
    }
  }

  // Load a module that defines component styles
  //
  // This uses Vite APIs to load a module in a way that does not impact the
  // module graph.  This enables the use of that module as a source for a build
  // plan to generate CSS.
  function loadStyleModule(id: string): Promise<ModuleValue> {
    const path = `${id}${STYLE_QUERY}`;

    return moduleRunner
      ? moduleRunner.import(path)
      : runnerImport<ModuleValue>(path, {
        configFile: false,
        root: config.root
      }).then(m => m.module);
  }

  return {
    buildStart() {
      owners.clear();
    },

    configResolved(resolved) {
      refreshNaming(() => config = resolved);
    },

    configureServer(devServer) {
      refreshNaming(() => {
        server = devServer;

        const { ssr } = devServer.environments;

        if (isRunnableDevEnvironment(ssr)) {
          moduleRunner = ssr.runner;
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
          `${RESOLVED}${getCSSModuleID(sourceID)}`
        );

        if (cssModule) {
          invalidate(cssModule);
        }
      };

      const styleSourceFromModule = (node: ModuleNode): string | undefined => {
        const id = node.id ?? '';
        const fromCSS = extractSourceModuleID(id);

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
      // Extract the ID of the module that defines component styles
      //
      // If the current ID is a virtual CSS module ID, this will extract the
      // ID of the source module to which transform() added the virtual import.
      const stylesID = extractSourceModuleID(id);

      if (stylesID === undefined) {
        return null;
      }

      // Ensure that changes to the source styles impact the virtual CSS module
      this.addWatchFile(stylesID);

      // Load the styles module and extract its build plan
      const module = await loadStyleModule(stylesID);
      const plan = extractBuildPlan(module.default);

      if (plan === undefined) {
        throw new Error(`${stylesID} must export Ruscus component styles.`);
      }

      // Register the styles module as the owner of the component
      //
      // If multiple modules attempt to claim the same component, this will
      // throw an error.
      owners.claim(plan.component.id, stylesID);

      // Project the virtual CSS module as concrete CSS text
      return {
        code: plan.compile({ naming }),
        moduleType: 'css',
        moduleSideEffects: true
      };
    },

    name: 'ruscus',

    resolveId(id) {
      // Use an internal ID for a virtual CSS module added by transform()
      return getInternalCSSModuleID(id);
    },

    transform(code, id) {
      // This avoids transforming modules that:
      //
      // - are known style modules loaded via load()
      // - are resolved, internal modules
      // - lacks style definitions
      if (
        id.includes(STYLE_QUERY)
        || id.startsWith(RESOLVED)
        || !mightContainStyles(code)
      ) {
        return null;
      }

      // Inject a virtual CSS module import into a styles module
      return {
        code: injectCSSImport(code, id),
        map: null
      };
    }
  };
}
