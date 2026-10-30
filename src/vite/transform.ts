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
export function getVirtualCSSModuleForSourceModule(id: string): string {
  return `${PREFIX}${encodeURIComponent(id)}${SUFFIX}`;
}

/**
 * Inject a CSS import into a source module's code
 */
export function injectCSSImport(code: string, id: string): string {
  const css = `import ${
    JSON.stringify(getVirtualCSSModuleForSourceModule(id))
  };`;

  return code.includes(css)
    ? code
    : `${css}\n${code}`;
}

/**
 * Determine whether an ID is for a virtual CSS module
 */
export function isVirtualCSSModuleID(id: string): boolean {
  return id.startsWith(PREFIX) && id.endsWith(SUFFIX);
}

/**
 * Check whether code might define component styles
 */
export function mightContainStyles(code: string): boolean {
  return code.includes('.apply()');
}

/**
 * Get the resolved internal ID of a virtual CSS module
 */
export function getResolvedVirtualCSSModuleID(id: string): string | null {
  return isVirtualCSSModuleID(id)
    ? `${RESOLVED}${id}`
    : null;
}
