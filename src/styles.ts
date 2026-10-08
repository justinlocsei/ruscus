import type { Styles } from './types.ts';

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
