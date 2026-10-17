import type { AnyComponentSpec } from './components.ts';
import type {
  AnyElementSpec,
  EmptyElementSpecs,
  NamedElements,
  VariantProjector
} from './elements.ts';
import { ELEMENT_ROOT } from './ids.ts';
import type { HasVariants } from './utils.ts';

/**
 * A component that can be applied to the DOM
 */
export type ApplicableComponent<S extends AnyComponentSpec> =
  & { [ELEMENT_ROOT]: ProjectElement<S> }
  & ElementProjectors<S['els']>;

/**
 * Project an element as class names
 */
export type ElementProjector<S extends AnyElementSpec> = [
  keyof S['children']
] extends [never] ? ProjectElement<S>
  : { [ELEMENT_ROOT]: ProjectElement<S> } & ElementProjectors<S['children']>;

/**
 * Project an element tree as class names
 */
export type ElementProjectors<
  E extends NamedElements<E> = EmptyElementSpecs
> = {
  [K in keyof E]: ElementProjector<E[K]>;
};

/**
 * Project a single element as a class name
 */
type ProjectElement<S extends HasVariants<string>> = [
  S['variants']
] extends [never] ? string : VariantProjector<S['variants']>;
