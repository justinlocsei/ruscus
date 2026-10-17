import type { NameGenerator } from '../naming.ts';
import {
  projectElementSelectors,
  projectVariantSelector
} from '../projection/elements.ts';
import type {
  AnyNestedContext,
  AnyVariantsContext,
  ElementDefinitions
} from '../types/elements.ts';

/**
 * Build a context for defining nested element styles
 */
export function buildNestedContext(
  namespace: string[],
  children: ElementDefinitions,
  {
    anchor = '&',
    name
  }: {
    anchor?: string;
    name: NameGenerator;
  }
): AnyNestedContext {
  return {
    els: projectElementSelectors(namespace, children, { name }),
    variants: projectVariantSelector(anchor)
  };
}

/**
 * Build a context for defining element variants
 */
export function buildVariantsContext(
  namespace: string[],
  children: ElementDefinitions,
  { name }: { name: NameGenerator }
): AnyVariantsContext {
  return {
    els: projectElementSelectors(namespace, children, { name })
  };
}
