// A Rollup/Vite prefix for virtual modules
export const VIRTUAL = '\0';

// A prefix for virtual CSS modules
const PREFIX = 'virtual:ruscus/css/';

// The suffix for virtual CSS modules
const SUFFIX = '.css';

// A prefix for a CSS module that has been resolved by the loader
const LOADER_PREFIX = `${VIRTUAL}${PREFIX}`;

/**
 * Wrap a valid CSS module ID with a loader prefix
 */
export function cssToLoader(id: string): string | undefined {
  return (id.startsWith(PREFIX) && cssToSource(id))
    ? `${VIRTUAL}${id}`
    : undefined;
}

/**
 * Extract the source module ID from a CSS module ID
 */
export function cssToSource(id: string): string | undefined {
  const prefix = id.startsWith(LOADER_PREFIX)
    ? LOADER_PREFIX
    : PREFIX;

  return (id.startsWith(prefix) && id.endsWith(SUFFIX))
    ? decodeURIComponent(id.slice(prefix.length, SUFFIX.length * -1))
    : undefined;
}

/**
 * Inject a CSS import into a source module's code
 */
export function injectCSSImport(code: string, id: string): string {
  const css = `import ${JSON.stringify(sourceToCSS(id))};`;

  return code.includes(css)
    ? code
    : `${css}\n${code}`;
}

/**
 * Check whether code is likely to contain component styles
 */
export function mayContainStyles(code: string): boolean {
  return code.includes('.apply()');
}

/**
 * Generate a CSS module ID from a source module ID
 */
export function sourceToCSS(id: string): string {
  return `${PREFIX}${encodeURIComponent(id)}${SUFFIX}`;
}
