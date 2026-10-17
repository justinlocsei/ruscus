import type { Component } from './components.ts';
import type { NameGenerator } from './naming.ts';
import { projectElements, projectNode } from './projection/elements.ts';
import type { AnyComponentSpec } from './types/components.ts';
import { ELEMENT_ROOT } from './types/ids.ts';
import type { ApplicableComponent } from './types/projection.ts';

/**
 * Project a component into applicable class names
 */
export function projectComponent<S extends AnyComponentSpec>(
  component: Component<S>,
  name: NameGenerator
): ApplicableComponent<S> {
  const { current } = component;

  return {
    ...projectElements(
      [component.id],
      current.elements,
      { format: 'names', name }
    ),
    [ELEMENT_ROOT]: projectNode(name([component.id]), {
      format: 'names',
      hasVariants: current.variants !== undefined
    })
  } as ApplicableComponent<S>;
}
