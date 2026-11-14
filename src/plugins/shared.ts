import type { ConfigOptions } from '../config.ts';
import type { Require } from '../types/utils.ts';

/**
 * Plugin options
 */
export type PluginOptions = {
  config?: ConfigOptions;
  extension?: string;
};

/**
 * A fully resolved plugin configuration
 */
export type PluginConfig = Require<PluginOptions, 'extension'>;

/**
 * Resolve plugin options to a configuration
 */
export function resolveConfig(options: PluginOptions): PluginConfig {
  return {
    ...options,
    extension: options.extension ?? '.styles.ts'
  };
}

/**
 * Strip an import query from a module ID
 */
export function stripQuery(id: string): string {
  const query = id.indexOf('?');

  return query === -1 ? id : id.slice(0, query);
}
