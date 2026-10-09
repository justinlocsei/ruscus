import type { Thunkable } from './types/utils.ts';

/**
 * Resolve an eager value or a thunk
 */
export function resolve<T>(value: Thunkable<T>): T {
  return typeof value === 'function'
    ? (value as () => T)()
    : value;
}
