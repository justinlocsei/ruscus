import type { Thunkable } from './types/utils.ts';

/**
 * Cast a value
 */
export function cast<T>(value: unknown): T {
  return value as T;
}

/**
 * Resolve an eager value or a thunk
 */
export function resolve<T>(value: Thunkable<T>): T {
  return typeof value === 'function'
    ? (value as () => T)()
    : value;
}
