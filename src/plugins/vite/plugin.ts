import type { ModuleNode, Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { isRunnableDevEnvironment, runnerImport } from 'vite';
import type { ModuleRunner } from 'vite/module-runner';

import { extractBuildPlan } from '../../internal.ts';
import type { PluginOptions } from '../shared.ts';
import { resolveConfig } from '../shared.ts';
import { ComponentRegistry } from './registry.ts';
import {
  extractSourceModuleID,
  getCSSModuleID,
  getInternalCSSModuleID,
  injectCSSImport,
  isResolvedModuleID,
  mightContainStyles
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
export function plugin(options: PluginOptions = {}): Plugin {
  const owners = new ComponentRegistry();
  const ruscus = resolveConfig(options);

  let config: ResolvedConfig;
  let moduleRunner: ModuleRunner | undefined;
  let server: ViteDevServer | undefined;

  // Infer an appropriate naming scheme after a change if no scheme was provided
  //
  // If the plugin appears to be running in a development environment, this
  // uses verbose naming.  Otherwise, compact naming is used.
  function refreshNaming(after: () => void): void {
    after();

    if (!options.naming) {
      ruscus.naming = (server || config?.command === 'serve')
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

        // Track the SSR runner for later use in loading style modules
        if (isRunnableDevEnvironment(ssr)) {
          moduleRunner = ssr.runner;
        }
      });
    },

    // Keep style and CSS modules in sync when a source file changes
    //
    // Vite only seeds HMR with modules tied directly to the changed file.
    // When a helper changes, the styles module that imports it may not
    // invalidate its virtual CSS module on its own.  This hook walks
    // importers upward until a styles source is found, refreshes its
    // virtual CSS module, and stops.
    handleHotUpdate({ file, modules, server }) {
      owners.release(file);

      const updated = new Set<ModuleNode>();
      const visited = new Set<ModuleNode>();
      const graph = server.moduleGraph;

      const invalidate = (node: ModuleNode) => {
        graph.invalidateModule(node);
        updated.add(node);
      };

      // Invalidate the virtual CSS module for a source module
      const invalidateCSSForSource = (sourceID: string) => {
        const cssModule = graph.getModuleById(
          getCSSModuleID(sourceID, { resolved: true })
        );

        if (cssModule) {
          invalidate(cssModule);
        }
      };

      // Find a Ruscus styles source file for a module graph node, if any
      const stylesSourceFromModule = (node: ModuleNode): string | undefined => {
        const id = node.id ?? '';
        const fromCSS = extractSourceModuleID(id);

        if (fromCSS !== undefined) {
          return fromCSS;
        }

        if (id.includes(STYLE_QUERY)) {
          return id.slice(0, id.indexOf(STYLE_QUERY));
        }

        const file = node.file;

        if (
          file !== null
          && graph.getModuleById(getCSSModuleID(file, { resolved: true }))
            !== undefined
        ) {
          return file;
        }

        return undefined;
      };

      // Walk importers until a styles source is found
      const visitModule = (node: ModuleNode) => {
        if (visited.has(node)) {
          return;
        }

        visited.add(node);
        invalidate(node);

        const styles = stylesSourceFromModule(node);

        // Invalidate the virtual CSS for a styles source and stop the walk
        if (styles !== undefined) {
          invalidateCSSForSource(styles);
          return;
        }

        for (const importer of node.importers) {
          visitModule(importer);
        }
      };

      // Visit all modules associated with the changed file
      for (const node of modules) {
        visitModule(node);
      }

      // Respond to direct edits to a styles module
      invalidateCSSForSource(file);

      return updated.size > 0 ? [...updated] : undefined;
    },

    async load(id) {
      // Extract the ID of the module that defines component styles
      //
      // If the current ID is a virtual CSS module ID, this will extract the
      // ID of the source module to which transform() added the virtual import.
      const sourceID = extractSourceModuleID(id);

      if (sourceID === undefined) {
        return null;
      }

      // Ensure that changes to the source styles impact the virtual CSS module
      this.addWatchFile(sourceID);

      // Load the styles module and extract its build plan
      const module = await loadStyleModule(sourceID);
      const plan = extractBuildPlan(module.default);

      if (plan === undefined) {
        throw new Error(`${sourceID} must export Ruscus component styles.`);
      }

      // Register the styles module as the owner of the component
      //
      // If multiple modules attempt to claim the same component, this will
      // throw an error.
      owners.claim(plan.component.id, sourceID);

      // Project the virtual CSS module as concrete CSS text
      return {
        code: plan.compile({ naming: ruscus.naming }),
        moduleType: 'css',
        moduleSideEffects: true
      };
    },

    name: 'ruscus',

    // Use an internal ID for a virtual CSS module added by transform()
    resolveId(id) {
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
        || isResolvedModuleID(id)
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
