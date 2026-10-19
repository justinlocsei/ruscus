import { projectElementSelectors } from '../projection/elements.ts';
import { projectIdentifiers } from '../projection/identifiers.ts';
import type {
  ComponentDefinition,
  DerivedComponentContext
} from '../types/components.ts';
import type { ContextOptions } from './elements.ts';
import { variants } from './elements.ts';

/**
 * Build a context for derived component styles
 */
export function buildComponentContext(
  component: ComponentDefinition,
  { name }: ContextOptions
): DerivedComponentContext {
  return {
    els: projectElementSelectors([component.id], component.elements, { name }),
    ids: projectIdentifiers(component),
    variants
  };
}
