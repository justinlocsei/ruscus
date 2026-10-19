import type { NameGenerator } from '../naming.ts';
import {
  projectElementSelectors,
  projectVariantSelector
} from '../projection/elements.ts';
import type {
  DerivedElementContext,
  ElementDefinitions
} from '../types/elements.ts';

/**
 * Shared context options
 */
export type ContextOptions = {
  name: NameGenerator;
};

export const variants = projectVariantSelector('&');

/**
 * Build a context for defining derived element styles
 */
export function buildElementContext(
  namespace: string[],
  children: ElementDefinitions,
  options: ContextOptions
): DerivedElementContext {
  return {
    els: projectElementSelectors(namespace, children, options),
    variants
  };
}
