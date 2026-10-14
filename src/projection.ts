import type { AnyComponent, Component } from './components.ts';
import { asProperty } from './css.ts';
import type { AnyElement, NamedElements } from './elements.ts';
import type { NameGenerator, NamingScheme } from './naming.ts';
import { useNaming } from './naming.ts';
import type {
  AnyComponentSpec,
  IdentifierValuesFor
} from './types/components.ts';
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
  const name = useNaming(component as unknown as AnyComponent, naming);

  const root = projectNode(
    name([component.id]),
    component.current.variants
  );

  const elements = projectElements(
    [component.id],
    component.current.elements,
    name
  ) as ElementProjectors<S['els']>;

  return {
    ...elements,
    root
  } as ApplicableComponent<S>;
}

/**
 * Project a component's identifiers as a map of labels to values
 */
export function projectIdentifiers<S extends AnyComponentSpec>(
  component: Component<S>
): IdentifierValuesFor<S> {
  return Object.fromEntries(
    Object.entries(component.current.identifiers).map(([name, type]) => {
      const scoped = `${component.id}--${asProperty(name)}`;

      return [
        name,
        type === 'variable' ? `--${scoped}` : scoped
      ];
    })
  ) as IdentifierValuesFor<S>;
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
  element: AnyElement,
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
