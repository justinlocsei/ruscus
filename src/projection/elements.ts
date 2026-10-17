import type { NameGenerator } from '../naming.ts';
import type {
  ElementDefinition,
  ElementDefinitions,
  Selectors,
  VariantSelector
} from '../types/elements.ts';
import { ELEMENT_ROOT } from '../types/ids.ts';
import type { VariantProjector } from '../types/projection.ts';

/**
 * The format for projected element resources
 */
type ProjectionFormat = 'names' | 'selectors';

/**
 * Project an element tree
 */
export function projectElements(
  namespace: string[],
  elements: ElementDefinitions,
  name: NameGenerator,
  format: ProjectionFormat
): Record<string, unknown> {
  return Object.entries(elements).reduce<Record<string, unknown>>(
    (previous, [key, element]) => {
      if (element === undefined) {
        return previous;
      }

      previous[key] = projectElement(
        [...namespace, key],
        element,
        name,
        format
      );

      return previous;
    },
    {} as Record<string, unknown>
  );
}

/**
 * Build a variant selector anchored to a compile-time root
 */
export function projectVariantSelector(
  anchor = '&'
): VariantSelector<string> {
  return (...vs) => `${anchor}${vs.map(v => `.is-${v}`).join('')}`;
}

/**
 * Format a class name for projection
 */
function formatName(className: string, format: ProjectionFormat): string {
  return format === 'selectors' ? `.${className}` : className;
}

/**
 * Project an element as a class name, selector, or child tree
 */
function projectElement(
  path: string[],
  element: ElementDefinition,
  name: NameGenerator,
  format: ProjectionFormat
): unknown {
  const className = name(path);
  const root = projectNode(className, element.variants !== undefined, format);
  const { children } = element;

  return Object.keys(children).length
    ? { [ELEMENT_ROOT]: root, ...projectElements(path, children, name, format) }
    : root;
}

/**
 * Project a node as a class name or variant projector
 */
export function projectNode(
  className: string,
  hasVariants: boolean,
  format: ProjectionFormat
): VariantProjector<string> | string {
  if (format === 'selectors') {
    return formatName(className, format);
  }

  return hasVariants
    ? (...vs) => [className, ...vs.map(v => `is-${v}`)].join(' ')
    : className;
}

/**
 * Project an element tree as CSS selectors
 */
export function projectElementSelectors(
  namespace: string[],
  elements: ElementDefinitions,
  name: NameGenerator
): Selectors {
  return {
    [ELEMENT_ROOT]: formatName(name(namespace), 'selectors'),
    ...projectElements(namespace, elements, name, 'selectors')
  } as Selectors;
}
