import type { NamedElements } from './elements.ts';
import { buildSelector, ELEMENT_ROOT } from './identifiers.ts';
import type {
  AnySelectors,
  Block,
  Declarations,
  NestedContext,
  NestedProvider,
  RuleBlock,
  Selectors
} from './types.ts';

/**
 * Build a context for defining nested rules
 */
export function buildNestedContext(
  namespace: string[],
  children: NamedElements
): NestedContext {
  return {
    els: buildSelectors(namespace, children),
    variant: (...ns) => `&${ns.map(n => `.is-${n}`).join('')}`
  };
}

/**
 * Build a selector for each item in an element tree
 */
function buildSelectors(
  namespace: string[],
  elements: NamedElements
): Selectors {
  const els: AnySelectors = {};

  for (const name of Object.keys(elements)) {
    const element = elements[name];

    if (element === undefined) {
      continue;
    }

    const path = [...namespace, name];
    const { children } = element.current;

    els[name] = Object.keys(children).length === 0
      ? buildSelector(path)
      : {
        [ELEMENT_ROOT]: buildSelector(path),
        ...buildSelectors(path, children)
      };
  }

  return els;
}

/**
 * Report whether a block contains only declarations
 */
export function isDeclarations(block: Block): block is Declarations {
  for (const value of Object.values(block)) {
    if (
      value !== undefined
      && typeof value !== 'number'
      && typeof value !== 'string'
    ) {
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
): RuleBlock {
  return typeof provider === 'function'
    ? provider(ctx)
    : provider;
}
