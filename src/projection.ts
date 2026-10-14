import type { Component } from './components.ts';
import type { Element, NamedElements } from './elements.ts';
import { buildIdentifiersContext } from './identifiers.ts';
import type { NameGenerator, NamingScheme } from './naming.ts';
import { useNaming } from './naming.ts';
import type { AnyComponentSpec } from './types/components.ts';
import type { VariantProvider } from './types/elements.ts';
import type {
  ApplicableComponent,
  ElementProjectors,
  VariantProjector
} from './types/projection.ts';

/**
 * Project a component
 */
export function projectComponent<S extends AnyComponentSpec>(
  component: Component<S>,
  { naming }: { naming?: NamingScheme } = {}
): ApplicableComponent<S> {
  type Applied = ApplicableComponent<S>;

  const name = useNaming(component, naming);

  const root = projectNode(
    name([component.id]),
    component.current.variants
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
    return { ...elements, root } as Applied;
  }

  const applied = ((name: keyof S['ids']) => ids[name]) as Applied;

  return Object.assign(applied, { ...elements, root }) as Applied;
}

/**
 * Project an element tree into class names
 */
function projectElements(
  namespace: string[],
  elements: NamedElements,
  name: NameGenerator
): Record<string, unknown> {
  return Object.entries(elements).reduce<Record<string, unknown>>(
    (previous, [key, element]) => {
      if (element === undefined) {
        return previous;
      }

      previous[key] = projectElement(
        [...namespace, key],
        element,
        name
      );

      return previous;
    },
    {} as Record<string, unknown>
  );
}

/**
 * Project an element as a lone class name or child projector
 */
function projectElement(
  path: string[],
  element: Element,
  name: NameGenerator
): unknown {
  const root = projectNode(
    name(path),
    element.current.variants
  );

  const { children } = element.current;

  return Object.keys(children).length
    ? { root, ...projectElements(path, children, name) }
    : root;
}

/**
 * Project a node as a class name or variant projector
 */
function projectNode(
  name: string,
  variants?: VariantProvider
): VariantProjector<string> | string {
  return variants
    ? (...vs: string[]) => [name, ...vs.map(v => `is-${v}`)].join(' ')
    : name;
}
