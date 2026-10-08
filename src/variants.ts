import type { VariantStyles } from './types.ts';

/**
 * Resolve eager and lazy variant definitions
 */
export function resolveVariants<T extends VariantStyles>(
  definitions: T | (() => T)
): T {
  return typeof definitions === 'function' ? definitions() : definitions;
}
