import type { NamedElements } from './elements.ts';
import { defineAbsoluteFragment, defineRelativeFragment } from './fragments.ts';
import { buildSelector, ELEMENT_ROOT } from './identifiers.ts';
import type {
  AnySelectors,
  Block,
  Declarations,
  GlobalDefinitions,
  GlobalProvider,
  NestedContext,
  NestedDefinitions,
  NestedProvider,
  Selectors,
  VariantDefinitions,
  VariantProvider
} from './types.ts';

/**
 * Build a context for defining nested rules
 */
export function buildNestedContext(
  namespace: string[],
  children: NamedElements,
  { root = '&' }: { root?: string } = {}
): NestedContext {
  const els: Selectors = {
    root: buildSelector(namespace),
    ...buildSelectors(namespace, children)
  };

  return {
    els,
    variants: (...ns) => `${root}${ns.map(n => `.is-${n}`).join('')}`
  };
}

/**
 * Build a context for defining global rules
 */
export function buildGlobalContext(
  block: string,
  children: NamedElements
): NestedContext {
  const namespace = [block];

  return buildNestedContext(namespace, children, {
    root: buildSelector(namespace)
  });
}

/**
 * Build a selector for each item in an element tree
 */
function buildSelectors(
  namespace: string[],
  elements: NamedElements
): AnySelectors {
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
 * Resolve global definitions from a provider
 */
export function resolveGlobalProvider<C extends NestedContext>(
  provider: GlobalProvider<C>,
  ctx: C
): GlobalDefinitions {
  return provider(defineAbsoluteFragment, ctx);
}

/**
 * Resolve nested definitions from a provider
 */
export function resolveNestedProvider<C extends NestedContext>(
  provider: NestedProvider<C>,
  ctx: C
): NestedDefinitions {
  return provider(defineRelativeFragment, ctx);
}

/**
 * Resolve variant definitions from a provider
 */
export function resolveVariantProvider<C extends NestedContext>(
  provider: VariantProvider<C>,
  ctx: C
): VariantDefinitions {
  return provider(defineRelativeFragment, ctx);
}
