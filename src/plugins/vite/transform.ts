// A Rollup/Vite prefix for virtual modules present in the graph
export const RESOLVED = '\0';

// A prefix for virtual CSS modules
const PREFIX = 'virtual:ruscus/css/';

// The suffix for virtual CSS modules
const SUFFIX = '.css';

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
 * Get the resolved internal ID of a virtual CSS module
 */
export function getInternalCSSModuleID(id: string): string | null {
  return isVirtualCSSModuleID(id)
    ? `${RESOLVED}${id}`
    : null;
}

/**
 * Inject a CSS import into a source module's code
 */
export function injectCSSImport(code: string, id: string): string {
  const css = `import ${JSON.stringify(getCSSModuleID(id))};`;

  return code.includes(css)
    ? code
    : `${css}\n${code}`;
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
