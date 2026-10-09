import type { Thunkable } from './types/utils.ts';
import type { VariantStyles } from './types.ts';
import { resolve } from './utils.ts';

/**
 * Resolve eager and lazy variant definitions
 */
export function resolveVariants<T extends VariantStyles>(
  definitions: Thunkable<T>
): T {
  return resolve(definitions);
}
