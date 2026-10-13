import type { Component } from './components.ts';
import type { Element, NamedElements } from './elements.ts';
import { buildIdentifiersContext, buildSelector } from './identifiers.ts';
import type {
  AnyComponentSpec,
  Applied,
  ElementProjectors,
  VariantProjector
} from './types.ts';

/**
 * Build class names from component and element path segments
 */
export function buildClassName(levels: readonly string[]): string {
  return buildSelector(levels).slice(1);
}

/**
 * Project a component into class names and identifier accessors
 */
export function projectComponent<S extends AnyComponentSpec>(
  component: Component<S>
): Applied<S> {
  const root = projectVariant(
    component.id,
    component.current.variants !== undefined
  );
  const elements = projectElements(
    [component.id],
    component.current.elements
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
  elements: NamedElements
): Record<string, unknown> {
  const projected: Record<string, unknown> = {};

  for (const [name, element] of Object.entries(elements)) {
    if (element === undefined) {
      continue;
    }

    projected[name] = projectElement(
      [...namespace, name],
      element
    );
  }

  return projected;
}

/**
 * Project one element into a class name or child projector
 */
function projectElement(
  path: readonly string[],
  element: Element
): unknown {
  const root = projectVariant(
    buildClassName(path),
    element.current.variants !== undefined
  );
  const children = element.current.children;

  if (Object.keys(children).length === 0) {
    return root;
  }

  return {
    root,
    ...projectElements(path, children)
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
