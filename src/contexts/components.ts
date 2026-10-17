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
  {
    anchor = '&',
    name
  }: {
    anchor?: string;
    name: NameGenerator;
  }
): AnyDerivedContext {
  const namespace = [component.id];

  return {
    els: projectElementSelectors(namespace, component.elements, { name }),
    variants: projectVariantSelector(anchor),
    ids: projectIdentifiers(component)
  };
}

/**
 * Build a context for defining a component's elements
 */
export function buildElementsContext(
  component: ComponentDefinition
): AnyElementsContext {
  return { ids: projectIdentifiers(component) };
}

/**
 * Build a context for defining a component's variants
 */
export function buildVariantsContext(
  component: ComponentDefinition,
  name: NameGenerator
): AnyVariantsContext {
  return {
    els: projectElementSelectors([component.id], component.elements, { name }),
    ids: projectIdentifiers(component)
  };
}
