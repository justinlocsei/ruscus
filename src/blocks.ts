import type { NamedElements } from './elements.ts';
import { defineAbsoluteFragment, defineRelativeFragment } from './fragments.ts';
import { ELEMENT_ROOT } from './identifiers.ts';
import type { NameGenerator } from './naming.ts';
import { createVerboseNameGenerator } from './naming.ts';
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
type NestedContextOptions = {
  name?: NameGenerator;
  root?: string;
};

export function buildNestedContext(
  namespace: string[],
  children: NamedElements,
  { name = createVerboseNameGenerator(), root = '&' }: NestedContextOptions = {}
): NestedContext {
  const rootClass = name(namespace);
  const els: Selectors = {
    root: `.${rootClass}`,
    ...buildSelectors(namespace, children, name)
  };

  return {
    els,
    variants: (...ns) => `${root}${ns.map(n => `.is-${n}`).join('')}`
  };
}

/**
 * Build a selector for each item in an element tree
 */
function buildSelectors(
  namespace: string[],
  elements: NamedElements,
  name: NameGenerator
): AnySelectors {
  const els: AnySelectors = {};

  for (const key of Object.keys(elements)) {
    const element = elements[key];

    if (element === undefined) {
      continue;
    }

    const path = [...namespace, key];
    const { children } = element.current;

    els[key] = Object.keys(children).length === 0
      ? `.${name(path)}`
      : {
        [ELEMENT_ROOT]: `.${name(path)}`,
        ...buildSelectors(path, children, name)
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
