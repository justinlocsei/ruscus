import type { ComponentSpec } from './components.ts';
import type {
  ElementSpec,
  NamedElements,
  VariantProjector
} from './elements.ts';
import { ELEMENT_ROOT } from './ids.ts';
import type { HasVariants } from './utils.ts';

/**
 * A component that is projected as class names
 */
export type ProjectedComponent<S extends ComponentSpec> =
  & { [ELEMENT_ROOT]: ProjectElement<S> }
  & ProjectedElements<S['els']>;

/**
 * An element projected as class names
 */
type ProjectedElement<S extends ElementSpec> = [
  keyof S['children']
] extends [never] ? ProjectElement<S>
  : { [ELEMENT_ROOT]: ProjectElement<S> } & ProjectedElements<S['children']>;

/**
 * An element tree projected as class names
 */
type ProjectedElements<E extends NamedElements<E>> = {
  [K in keyof E]: ProjectedElement<E[K]>;
};

/**
 * Project a single element as a class name
 */
type ProjectElement<S extends HasVariants<string>> = [
  S['variants']
] extends [never] ? string : VariantProjector<S['variants']>;
