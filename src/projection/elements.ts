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
  {
    format,
    hasVariants,
    name
  }: {
    format: ProjectionFormat;
    hasVariants: boolean;
    name: NameGenerator;
  }
): ProjectTree<R, E> {
  return {
    ...projectElements(namespace, elements, { format, name }),
    [ELEMENT_ROOT]: projectNode(name.forClass(namespace), {
      format,
      hasVariants,
      name
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
  return Object.entries(elements).reduce(
    (previous, [key, element]) => {
      if (element) {
        previous[key as keyof E] = projectElement(
          [...namespace, key],
          element,
          { format, name }
        );
      }

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
    : projectNode(options.name.forClass(path), {
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
    hasVariants,
    name
  }: ProjectElementOptions & {
    hasVariants: boolean;
  }
): VariantProjector<string> | string {
  const root = formatClass(className, format);

  return hasVariants
    ? createVariantProjector(root, format, name)
    : root;
}

/**
 * Format a class name
 */
function formatClass(name: string, format: ProjectionFormat): string {
  return format === 'selectors' ? `.${name}` : name;
}

/**
 * Create a variant projector anchored to a compile-time root
 */
export function createVariantProjector(
  anchor: string,
  format: ProjectionFormat,
  name: NameGenerator
): VariantProjector<string> {
  const joiner = format === 'selectors' ? '' : ' ';

  return (...vs) => {
    const names = vs.filter(Boolean) as string[];

    return [
      anchor,
      ...names.map(v => formatClass(name.forVariant(v), format))
    ].join(joiner);
  };
}
