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

/**
 * Strip an import query from a module ID
 */
export function stripQuery(id: string): string {
  const query = id.indexOf('?');

  return query === -1 ? id : id.slice(0, query);
}

/**
 * Report whether a module ID provides styles
 */
export function isStyleModuleID(id: string, extension: string): boolean {
  return stripQuery(id).endsWith(extension);
}
