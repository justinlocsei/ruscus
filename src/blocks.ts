import { buildSelector } from './identifiers.ts';
import type { Thunkable } from './types/utils.ts';
import type { Block, Styles } from './types.ts';

/**
 * The context available to nested rule definitions
 */
export type NestedContext = {
  els: Record<string, string>;
};

/**
 * Build a nested context for an element within a component
 */
export function buildNestedContext(
  namespace: string[],
  children: string[]
): NestedContext {
  const els: Record<string, string> = {};

  for (const child of children) {
    els[child] = buildSelector([...namespace, child]);
  }

  return { els };
}

/**
 * A provider of nested styles
 */
export type NestedProvider =
  | Thunkable<Block>
  | ((ctx: NestedContext) => Block);

/**
 * Report whether a block contains only style declarations
 */
export function isStyles(block: Block): block is Styles {
  for (const value of Object.values(block)) {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return false;
    }
  }

  return true;
}

/**
 * Resolve nested definitions from a provider
 */
export function resolveNestedProvider(
  provider: NestedProvider,
  ctx: NestedContext
): Block {
  return typeof provider === 'function' ? provider(ctx) : provider;
}
