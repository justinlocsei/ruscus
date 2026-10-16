import type { Styles } from './css.ts';
import type { DerivedFragmentProvider } from './fragments.ts';
import type { ElementRoot } from './ids.ts';
import { ELEMENT_ROOT } from './ids.ts';
import type { EmptyObject, HasVariants, Patch } from './utils.ts';

/**
 * The most inclusive form of an element spec
 */
export type AnyElementSpec = ElementSpec<ElementSpecs, string>;

/**
 * The most inclusive form of a nested context
 */
export type AnyNestedContext = NestedContext<ElementSpecs, string>;

/**
 * The most inclusive form of a variants context
 */
export type AnyVariantsContext = VariantsContext<ElementSpecs>;

/**
 * Get selectors for an element with children
 */
type ChildSelectors<C extends NamedElements<C>> = {
  [K in ElementRoot | keyof C]: K extends ElementRoot ? string
    : SelectorForSpec<C[Extract<K, keyof C>]>;
};

/**
 * The data that fully defines an element
 */
export type ElementDefinition = {
  children: ElementDefinitions;
  nested: NestedProvider<AnyNestedContext>[];
  styles: Styles;
  variants?: VariantsProvider<AnyVariantsContext>;
};

/**
 * A mapping of element names to definitions
 */
export type ElementDefinitions = Record<string, ElementDefinition>;

/**
 * A specification for an element
 */
export type ElementSpec<
  C extends ElementSpecs,
  V extends string
> = HasVariants<V> & {
  children: C;
};

/**
 * A nested collection of named element specs
 */
export type ElementSpecs<T extends string = string> = {
  [K in T]: ElementSpec<ElementSpecs | EmptyElementSpecs, string>;
};

/**
 * An empty element spec
 */
export type EmptyElementSpec = ElementSpec<
  EmptyElementSpecs,
  never
>;

/**
 * An empty set of element specs
 */
export type EmptyElementSpecs = EmptyObject;

/**
 * A constraint on element specs that preserves each element's type
 */
export type NamedElements<E> = { [K in keyof E]: AnyElementSpec };

/**
 * The context available to nested element definitions
 */
export type NestedContext<
  E extends NamedElements<E> = EmptyElementSpecs,
  V extends string = never
> = {
  els: Selectors<E>;
  variants: VariantSelector<V>;
};

/**
 * A provider of nested styles
 */
export type NestedProvider<C extends NestedContext = NestedContext> =
  DerivedFragmentProvider<C, 'relative'>;

/**
 * Replace selected fields in an element spec
 */
export type PatchElementSpec<
  S extends AnyElementSpec,
  U extends Partial<AnyElementSpec>
> = Patch<AnyElementSpec, S, U>;

/**
 * Produce class selectors for a set of elements
 */
export type Selectors<E extends NamedElements<E> = EmptyElementSpecs> =
  & { [ELEMENT_ROOT]: string }
  & { [K in keyof E]: SelectorForSpec<E[K]> };

/**
 * Resolve the selector type for an element spec
 */
type SelectorForSpec<S extends AnyElementSpec> = [
  keyof S['children']
] extends [never] ? string
  : S['children'] extends NamedElements<S['children']>
    ? ChildSelectors<S['children']>
  : never;

/**
 * A projector for a selector that uses one or more variants
 */
export type VariantSelector<V extends string> = <T extends V>(
  ...names: T[]
) => string;

/**
 * The context available to variant definitions
 */
export type VariantsContext<
  E extends NamedElements<E> = EmptyElementSpecs
> = {
  els: Selectors<E>;
};

/**
 * Extract variant names from a provider
 */
export type VariantsFromProvider<P> = P extends VariantsProvider
  ? keyof ReturnType<P>
  : never;

/**
 * A provider of variants
 */
export type VariantsProvider<C extends VariantsContext = VariantsContext> =
  DerivedFragmentProvider<C, 'relative'>;
