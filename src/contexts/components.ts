import { projectElementSelectors } from '../projection/elements.ts';
import { projectIdentifiers } from '../projection/identifiers.ts';
import type {
  AnyDerivedContext,
  AnyElementsContext,
  AnyVariantsContext,
  ComponentDefinition
} from '../types/components.ts';
import type { ContextOptions } from './elements.ts';
import { variants } from './elements.ts';

/**
 * Build a context for derived component styles
 */
export function buildDerivedContext(
  component: ComponentDefinition,
  { name }: ContextOptions
): AnyDerivedContext {
  return {
    ...buildVariantsContext(component, { name }),
    ...buildElementsContext(component),
    variants
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
  { name }: ContextOptions
): AnyVariantsContext {
  return {
    ...buildElementsContext(component),
    els: projectElementSelectors([component.id], component.elements, { name })
  };
}
