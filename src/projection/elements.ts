import type { NameGenerator } from '../naming.ts';
import type {
  ElementDefinition,
  ElementDefinitions,
  ElementSpec,
  NamedElements,
  ProjectElement,
  ProjectElements,
  ProjectTree,
  VariantProjector
} from '../types/elements.ts';
import { ELEMENT_ROOT } from '../types/ids.ts';
import type { HasVariants } from '../types/utils.ts';

/**
 * The format for projected element resources
 */
type ProjectionFormat = 'names' | 'selectors';

/**
 * Options for projecting an element tree
 */
type ProjectElementTreeOptions = {
  format: ProjectionFormat;
  hasVariants: boolean;
  name: NameGenerator;
};

/**
 * Options for projecting an element
 */
type ProjectElementOptions = {
  format: ProjectionFormat;
  name: NameGenerator;
};

/**
 * Project a root node and its children
 */
export function projectTree<
  R extends HasVariants<string>,
  E extends NamedElements<E>
>(
  namespace: string[],
  elements: ElementDefinitions,
  { format, hasVariants, name }: ProjectElementTreeOptions
): ProjectTree<R, E> {
  return {
    ...projectElements(namespace, elements, { format, name }),
    [ELEMENT_ROOT]: projectNode(name(namespace), {
      format,
      hasVariants
    })
  } as ProjectTree<R, E>;
}

/**
 * Project elements under a namespace
 */
function projectElements<E extends NamedElements<E>>(
  namespace: string[],
  elements: ElementDefinitions,
  { format, name }: ProjectElementOptions
): ProjectElements<E> {
  return Object.entries(elements).reduce<ProjectElements<E>>(
    (previous, [key, element]) => {
      if (element === undefined) {
        return previous;
      }

      previous[key as keyof E] = projectElement(
        [...namespace, key],
        element,
        { format, name }
      ) as ProjectElements<E>[keyof E];

      return previous;
    },
    {} as ProjectElements<E>
  );
}

/**
 * Project an element as a class name, selector, or child tree
 */
function projectElement<S extends ElementSpec>(
  path: string[],
  element: ElementDefinition,
  options: ProjectElementOptions
): ProjectElement<S> {
  const { children } = element;
  const hasVariants = element.variants !== undefined;

  return (Object.keys(children).length
    ? projectTree<S, S['children']>(path, children, {
      ...options,
      hasVariants
    })
    : projectNode(options.name(path), {
      ...options,
      hasVariants
    })) as ProjectElement<S>;
}

/**
 * Project a node as a class name or variant projector
 */
function projectNode(
  className: string,
  {
    format,
    hasVariants
  }: {
    format: ProjectionFormat;
    hasVariants: boolean;
  }
): VariantProjector<string> | string {
  const project = (name: string) =>
    format === 'selectors'
      ? `.${name}`
      : name;

  const root = project(className);
  const joiner = format === 'selectors' ? '' : ' ';

  return hasVariants
    ? (...vs) => [root, ...vs.map(v => project(`is-${v}`))].join(joiner)
    : root;
}

/**
 * Build a variant selector anchored to a compile-time root
 */
export function projectVariantSelector(
  anchor: string
): VariantProjector<string> {
  return (...vs) => `${anchor}${vs.map(v => `.is-${v}`).join('')}`;
}
