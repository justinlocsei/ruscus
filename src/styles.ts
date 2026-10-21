import type { Styles } from './types/css.ts';

/**
 * Project a camel-cased value as a CSS identifier
 */
export function asIdentifier(camel: string): string {
  return camel.replace(
    /[A-Z]/g,
    l => `-${l.toLowerCase()}`
  );
}

/**
 * Merge multiple styles on top of a base
 */
export function mergeStyles(base: Styles, ...others: Styles[]): Styles {
  const merged = { ...base };

  for (const other of others) {
    Object.assign(merged, other);
  }

  return merged;
}
