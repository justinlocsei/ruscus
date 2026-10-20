import type { NameGenerator } from './naming.ts';
import {
  projectElementSelectors,
  projectVariantSelector
} from './projection/elements.ts';
import { projectIdentifiers } from './projection/identifiers.ts';
import type {
  ComponentDefinition,
  DerivedComponentContext
} from './types/components.ts';
import type {
  DerivedElementContext,
  ElementDefinition
} from './types/elements.ts';

/**
 * Shared context options
 */
type ContextOptions = {
  name: NameGenerator;
};

const variants = projectVariantSelector('&');

/**
 * Build a context for derived component styles
 */
export function buildComponentContext(
  component: ComponentDefinition,
  { name }: ContextOptions
): DerivedComponentContext {
  return {
    els: projectElementSelectors(
      [component.id],
      component.elements,
      { hasVariants: component.variants !== undefined, name }
    ),
    ids: projectIdentifiers(component),
    variants
  };
}

/**
 * Build a context for derived element styles
 */
export function buildElementContext(
  namespace: string[],
  element: ElementDefinition,
  { name }: ContextOptions
): DerivedElementContext {
  return {
    els: projectElementSelectors(namespace, element.children, {
      hasVariants: element.variants !== undefined,
      name
    }),
    variants
  };
}
