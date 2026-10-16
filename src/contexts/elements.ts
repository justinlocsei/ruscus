import type { NameGenerator } from '../naming.ts';
import type { AnySelectors } from '../types/css.ts';
import type {
  AnyNestedContext,
  ElementDefinitions,
  Selectors,
  VariantSelector
} from '../types/elements.ts';
import { ELEMENT_ROOT } from '../types/ids.ts';

const defaultName: NameGenerator = levels => levels.join('__');

/**
 * Build class selectors for all elements under a namespace
 */
export function buildElementSelectors(
  namespace: string[],
  children: ElementDefinitions,
  { name }: { name: NameGenerator }
): Selectors {
  const root = name(namespace);

  return {
    root: `.${root}`,
    ...buildSelectors(namespace, children, name)
  };
}

/**
 * Build a variant selector anchored to root
 */
export function buildVariantSelector(
  anchor = '&'
): VariantSelector<string> {
  return (...names) => `${anchor}${names.map(n => `.is-${n}`).join('')}`;
}

/**
 * Build a context for defining nested element styles
 */
export function buildElementDerivedContext(
  namespace: string[],
  children: ElementDefinitions,
  {
    anchor = '&',
    name = defaultName
  }: {
    anchor?: string;
    name?: NameGenerator;
  } = {}
): AnyNestedContext {
  return {
    els: buildElementSelectors(namespace, children, { name }),
    variants: buildVariantSelector(anchor)
  };
}

/**
 * Build a selector for each item in an element tree
 */
function buildSelectors(
  namespace: string[],
  elements: ElementDefinitions,
  name: NameGenerator
): AnySelectors {
  return Object.entries(elements).reduce<AnySelectors>(
    (previous, [key, element]) => {
      if (element === undefined) {
        return previous;
      }

      const path = [...namespace, key];
      const { children } = element;

      previous[key] = Object.keys(children).length === 0
        ? `.${name(path)}`
        : {
          [ELEMENT_ROOT]: `.${name(path)}`,
          ...buildSelectors(path, children, name)
        };

      return previous;
    },
    {}
  );
}
