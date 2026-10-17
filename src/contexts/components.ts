import type { NameGenerator } from '../naming.ts';
import {
  projectElementSelectors,
  projectVariantSelector
} from '../projection/elements.ts';
import { projectIdentifiers } from '../projection/identifiers.ts';
import type {
  AnyDerivedContext,
  AnyElementsContext,
  AnyVariantsContext,
  ComponentDefinition
} from '../types/components.ts';

/**
 * Build a context for derived component styles
 */
export function buildDerivedContext(
  component: ComponentDefinition,
  { name }: { name: NameGenerator }
): AnyDerivedContext {
  return {
    ...buildVariantsContext(component, name),
    ...buildElementsContext(component),
    variants: projectVariantSelector('&')
  };
}

/**
 * Build a context for defining a component's elements
 */
export function buildElementsContext(
  component: ComponentDefinition
): AnyElementsContext {
  return {
    ids: projectIdentifiers(component)
  };
}

/**
 * Build a context for defining a component's variants
 */
export function buildVariantsContext(
  component: ComponentDefinition,
  name: NameGenerator
): AnyVariantsContext {
  return {
    ...buildElementsContext(component),
    els: projectElementSelectors([component.id], component.elements, { name })
  };
}
