import type { Component } from './components.ts';
import type { NameGenerator } from './naming.ts';
import { projectElementTree } from './projection/elements.ts';
import type { ComponentSpec } from './types/components.ts';
import type { ProjectedComponent } from './types/projection.ts';

/**
 * Project a component into applicable class names
 */
export function projectComponent<S extends ComponentSpec>(
  component: Component<S>,
  name: NameGenerator
): ProjectedComponent<S> {
  const { current } = component;

  return projectElementTree(
    [component.id],
    current.elements,
    {
      format: 'names',
      hasVariants: current.variants !== undefined,
      name
    }
  ) as ProjectedComponent<S>;
}
