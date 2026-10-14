import type { Component } from './components.ts';
import type { Element, NamedElements } from './elements.ts';
import { buildIdentifiersContext } from './identifiers.ts';
import type { NameGenerator, NamingScheme } from './naming.ts';
import { useNaming } from './naming.ts';
import type {
  AnyComponentSpec,
  Applied,
  ElementProjectors,
  VariantProjector
} from './types.ts';

/**
 * Options for projecting class names
 */
export type ProjectConfig = {
  naming?: NamingScheme;
};

/**
 * Project a component into class names and identifier accessors
 */
export function projectComponent<S extends AnyComponentSpec>(
  component: Component<S>,
  config: ProjectConfig = {}
): Applied<S> {
  const name = useNaming(component, config.naming);
  const root = projectVariant(
    name([component.id]),
    component.current.variants !== undefined
  );
  const elements = projectElements(
    [component.id],
    component.current.elements,
    name
  ) as ElementProjectors<S['els']>;

  const ids = buildIdentifiersContext(
    component.id,
    component.current.identifiers
  ).ids as Record<keyof S['ids'], string>;

  if (Object.keys(ids).length === 0) {
    return { ...elements, root } as Applied<S>;
  }

  const applied = ((name: keyof S['ids']) => ids[name]) as Applied<S>;

  return Object.assign(applied, { ...elements, root }) as Applied<S>;
}

/**
 * Project an element tree into class names
 */
function projectElements(
  namespace: readonly string[],
  elements: NamedElements,
  name: NameGenerator
): Record<string, unknown> {
  const projected: Record<string, unknown> = {};

  for (const [key, element] of Object.entries(elements)) {
    if (element === undefined) {
      continue;
    }

    projected[key] = projectElement(
      [...namespace, key],
      element,
      name
    );
  }

  return projected;
}

/**
 * Project one element into a class name or child projector
 */
function projectElement(
  path: readonly string[],
  element: Element,
  name: NameGenerator
): unknown {
  const root = projectVariant(
    name(path),
    element.current.variants !== undefined
  );
  const children = element.current.children;

  if (Object.keys(children).length === 0) {
    return root;
  }

  return {
    root,
    ...projectElements(path, children, name)
  };
}

/**
 * Build a root or element class projector
 */
function projectVariant(
  className: string,
  hasVariants: boolean
): VariantProjector<string> | string {
  if (!hasVariants) {
    return className;
  }

  return (...names: string[]) =>
    [className, ...names.map(name => `is-${name}`)].join(' ');
}
