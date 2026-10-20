import type { Styles } from './css.ts';
import type { DerivedStyles } from './fragments.ts';
import { ELEMENT_ROOT } from './ids.ts';
import type { EmptyObject, HasVariants } from './utils.ts';

/**
 * The context available when defining derived element styles
 */
export type DerivedElementContext<
  S extends ElementSpec = ElementSpec
> = {
  els: Selectors<S['children']>;
  variants: VariantProjector<S['variants']>;
};

/**
 * A provider of styles derived from an element context
 */
export type DerivedElementStyles<
  C extends object = DerivedElementContext
> = DerivedStyles<'relative', C>;

/**
 * The data that fully defines an element
 */
export type ElementDefinition = {
  children: ElementDefinitions;
  nested: DerivedElementStyles[];
  styles: Styles;
  variants?: DerivedElementStyles;
};

/**
 * A mapping of element names to definitions
 */
export type ElementDefinitions = Record<string, ElementDefinition>;

/**
 * A specification for an element
 */
export type ElementSpec<
  C extends ElementSpecs = ElementSpecs,
  V extends string = string
> = HasVariants<V> & {
  children: C;
};

/**
 * A nested collection of named element specs
 */
export type ElementSpecs = { [K in string]: ElementSpec };

/**
 * An empty element spec
 */
export type EmptyElementSpec = ElementSpec<EmptyElementSpecs, never>;

/**
 * An empty set of element specs
 */
export type EmptyElementSpecs = EmptyObject;

/**
 * A constraint on element specs that preserves each element's type
 */
export type NamedElements<E> = { [K in keyof E]: ElementSpec };

/**
 * Produce class selectors for a set of elements
 */
export type Selectors<E extends NamedElements<E> = ElementSpecs> =
  & { [ELEMENT_ROOT]: string }
  & { [K in keyof E]: SelectorForSpec<E[K]> };

/**
 * Resolve the selector type for an element spec
 */
type SelectorForSpec<S extends ElementSpec> = [
  keyof S['children']
] extends [never] ? string
  : S['children'] extends NamedElements<S['children']>
    ? Selectors<S['children']>
  : never;

/**
 * A projector for a selector that uses one or more variants
 */
export type VariantProjector<V extends string> = <T extends V>(
  ...names: T[]
) => string;

/**
 * Extract variant names from a provider
 */
export type VariantsFromProvider<P> = P extends DerivedStyles
  ? keyof ReturnType<P>
  : never;
