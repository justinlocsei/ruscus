import type { NameGenerator } from './naming.ts';
import { createVariantProjector, projectTree } from './projection/elements.ts';
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

/**
 * Build a context for derived component styles
 */
export function buildComponentContext(
  component: ComponentDefinition,
  { name }: ContextOptions
): DerivedComponentContext {
  return {
    els: projectTree(
      [component.id],
      component.elements,
      {
        format: 'selectors',
        hasVariants: component.variants !== undefined,
        name
      }
    ),
    ids: projectIdentifiers(component),
    variants: createVariantProjector('&', 'selectors', name)
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
    els: projectTree(
      namespace,
      element.children,
      {
        format: 'selectors',
        hasVariants: element.variants !== undefined,
        name
      }
    ),
    variants: createVariantProjector('&', 'selectors', name)
  };
}
