import type { NamingScheme } from '../naming.ts';

export type { NamingScheme };

/**
 * Plugin options
 */
export type PluginOptions = {
  extension?: string;
  naming?: NamingScheme;
};

/**
 * A fully resolved plugin configuration
 */
export type PluginConfig = Required<PluginOptions>;

/**
 * Resolve plugin options to a configuration
 */
export function resolveConfig(options: PluginOptions): PluginConfig {
  return {
    extension: options.extension ?? '.styles.ts',
    naming: options.naming ?? 'compact'
  };
}
