import type { RelativeFragmentFactory, ScopedFragments } from './fragments.ts';
import type { ElementRoot } from './ids.ts';
import type { EmptyObject, HasVariants, Patch } from './utils.ts';

/**
 * The most inclusive form of an element spec
 */
export type AnyElementSpec = ElementSpec<ElementSpecs, string>;

/**
 * Get selectors for an element with children
 */
type ChildSelectors<C extends NamedElements<C>> = {
  [K in ElementRoot | keyof C]: K extends ElementRoot ? string
    : SelectorForSpec<C[Extract<K, keyof C>]>;
};

/**
 * A specification for an element
 */
export type ElementSpec<
  C extends ElementSpecs = EmptyElementSpecs,
  V extends string = never
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
 * Nested rule definitions keyed by selector
 */
export type NestedDefinitions = ScopedFragments<'relative'>;

/**
 * A provider of nested styles
 */
export type NestedProvider<C extends NestedContext = NestedContext> = (
  s: RelativeFragmentFactory,
  ctx: C
) => NestedDefinitions;

/**
 * Replace selected fields in an element spec
 */
export type PatchElementSpec<
  S extends AnyElementSpec,
  U extends Partial<AnyElementSpec>
> = Patch<AnyElementSpec, S, U>;

/**
 * Produce Class selectors for a set of nested elements
 */
export type Selectors<E extends NamedElements<E> = EmptyElementSpecs> =
  & { root: string }
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
 * Definitions for variant styles
 */
type VariantDefinitions = ScopedFragments<'relative'>;

/**
 * A provider of variant styles
 */
export type VariantProvider<C extends NestedContext = NestedContext> = (
  s: RelativeFragmentFactory,
  ctx: C
) => VariantDefinitions;

/**
 * Extract variant names from a provider
 */
export type VariantsFromProvider<P> = P extends (
  s: RelativeFragmentFactory,
  ctx: infer _C
) => infer R ? R extends VariantDefinitions ? Extract<keyof R, string>
  : never
  : never;

/**
 * A projector for a selector that uses one or more variants
 */
export type VariantSelector<V extends string> = <T extends V>(
  ...names: T[]
) => string;
