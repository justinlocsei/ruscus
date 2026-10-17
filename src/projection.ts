import type { Component } from './components.ts';
import type { NameGenerator } from './naming.ts';
import { projectElementTree } from './projection/elements.ts';
import type { AnyComponentSpec } from './types/components.ts';
import type { ApplicableComponent } from './types/projection.ts';

/**
 * Project a component into applicable class names
 */
export function projectComponent<S extends AnyComponentSpec>(
  component: Component<S>,
  name: NameGenerator
): ApplicableComponent<S> {
  const { current } = component;

  return projectElementTree(
    [component.id],
    current.elements,
    {
      format: 'names',
      hasVariants: current.variants !== undefined,
      name
    }
  ) as ApplicableComponent<S>;
}
