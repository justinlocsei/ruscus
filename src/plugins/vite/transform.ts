import type { ConfigOptions } from '../../config.ts';

// A Rollup/Vite prefix for virtual modules present in the graph
export const RESOLVED = '\0';

// The public ID of the virtual configuration module
export const CONFIG_MODULE_ID = 'virtual:ruscus/config';

// A prefix for virtual CSS modules
const PREFIX = 'virtual:ruscus/css/';

// The suffix for virtual CSS modules
const SUFFIX = '.css';

/**
 * Produce source for the virtual configure module
 */
export function createConfigureModuleCode(
  options: Partial<ConfigOptions>
): string {
  return `import { configure } from 'ruscus';\nconfigure(${
    JSON.stringify(options)
  });\n`;
}

/**
 * Extract the ID of the source module associated with a virtual CSS module
 */
export function extractSourceModuleID(source: string): string | undefined {
  const id = source.startsWith(RESOLVED)
    ? source.slice(RESOLVED.length)
    : source;

  return isVirtualCSSModuleID(id)
    ? decodeURIComponent(id.slice(PREFIX.length, SUFFIX.length * -1))
    : undefined;
}

/**
 * Get the ID of the virtual CSS module that accompanies a source module
 */
export function getCSSModuleID(
  id: string,
  { resolved = false }: { resolved?: boolean } = {}
): string {
  return `${resolved ? RESOLVED : ''}${PREFIX}${
    encodeURIComponent(id)
  }${SUFFIX}`;
}

/**
 * Get the resolved internal ID of the virtual configure module
 */
export function getInternalConfigModuleID(): string {
  return `${RESOLVED}${CONFIG_MODULE_ID}`;
}

/**
 * Get the resolved internal ID of a virtual CSS module
 */
export function getInternalCSSModuleID(id: string): string | null {
  return isVirtualCSSModuleID(id)
    ? `${RESOLVED}${id}`
    : null;
}

/**
 * Inject an import into a source module's code
 */
function injectImport(code: string, source: string): string {
  const line = `import ${JSON.stringify(source)};`;

  return code.includes(line)
    ? code
    : `${line}\n${code}`;
}

/**
 * Inject a CSS import into a source module's code
 */
function injectCSSImport(code: string, id: string): string {
  return injectImport(code, getCSSModuleID(id));
}

/**
 * Inject an import of the virtual configure module
 */
function injectConfigImport(code: string): string {
  return injectImport(code, CONFIG_MODULE_ID);
}

/**
 * Inject configure and optional CSS imports into a styles module
 */
export function injectStyleImports(
  code: string,
  sourceID: string,
  { css = true }: { css?: boolean } = {}
): string {
  const next = css ? injectCSSImport(code, sourceID) : code;

  return injectConfigImport(next);
}

/**
 * Determine whether an ID is for the virtual configure module
 */
export function isVirtualConfigModuleID(id: string): boolean {
  const bare = id.startsWith(RESOLVED)
    ? id.slice(RESOLVED.length)
    : id;

  return bare === CONFIG_MODULE_ID;
}

/**
 * Report whether a module ID has been resolved to an internal ID
 */
export function isResolvedModuleID(id: string): boolean {
  return id.startsWith(RESOLVED);
}

/**
 * Determine whether an ID is for a virtual CSS module
 */
export function isVirtualCSSModuleID(id: string): boolean {
  return id.startsWith(PREFIX) && id.endsWith(SUFFIX);
}
