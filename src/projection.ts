import type { Component } from './components.ts';
import type { NameGenerator } from './naming.ts';
import { projectTree } from './projection/elements.ts';
import type { ComponentSpec, ProjectedComponent } from './types/components.ts';

/**
 * Project a component as class names
 */
export function projectComponent<S extends ComponentSpec>(
  { current }: Component<S>,
  name: NameGenerator
): ProjectedComponent<S> {
  return projectTree<S, S['els']>(
    [current.id],
    current.elements,
    {
      format: 'names',
      hasVariants: current.variants !== undefined,
      name
    }
  );
}
