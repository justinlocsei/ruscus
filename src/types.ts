import type { Fragment, FragmentFactory } from './fragments.ts';
import type { Patch } from './types/utils.ts';

export const ELEMENT_ROOT = 'root';

/**
 * The most inclusive form of a component spec
 */
export type AnyComponentSpec = ComponentSpec<
  ElementSpecs,
  string,
  IdentifierTypes
>;

/**
 * The most inclusive form of an element spec
 */
export type AnyElementSpec = ElementSpec<ElementSpecs, string>;

/**
 * A constraint on element specs that preserves each element's type
 */
type AnyElementSpecs<E> = { [K in keyof E]: AnyElementSpec };

/**
 * The generic shape for element-specific class selectors
 */
export type AnySelectors = {
  [name: string]: AnySelectors | string;
};

/**
 * A block containing either declarations or nested rules
 */
export type Block = Declarations | RuleBlock;

/**
 * Get selectors for an element with children
 */
type ChildSelectors<C extends AnyElementSpecs<C>> = {
  [K in typeof ELEMENT_ROOT | keyof C]: K extends typeof ELEMENT_ROOT ? string
    : SelectorForSpec<C[Extract<K, keyof C>]>;
};

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends ElementSpecs = EmptyElementSpecs,
  V extends string = never,
  I extends IdentifierTypes = EmptyIdentifierTypes
> = {
  els: E;
  ids: I;
  variants: V;
};

/**
 * CSS declarations in a nested rule block
 */
export type Declarations = {
  [property: string]: Value | undefined;
};

/**
 * A specification for an element
 */
export type ElementSpec<
  E extends ElementSpecs = EmptyElementSpecs,
  V extends string = never
> = {
  children: E;
  variants: V;
};

/**
 * A collection of named element specs
 */
export type ElementSpecs<T extends string = string> = {
  [K in T]: ElementSpec<ElementSpecs | EmptyElementSpecs, string>;
};

/**
 * An empty set of element specs
 */
export type EmptyElementSpecs = { [K in never]: never };

/**
 * An empty set of identifier types
 */
export type EmptyIdentifierTypes = { [K in never]: never };

/**
 * A type for a component-specific identifier
 */
type IdentifierType = 'string' | 'variable';

/**
 * A mapping of local identifier names to their types
 */
export type IdentifierTypes = Record<string, IdentifierType>;

/**
 * The identifier values available while defining component styles
 */
export type IdentifiersContext<I extends IdentifierTypes = IdentifierTypes> = {
  ids: { [K in keyof I]: string };
};

/**
 * The context available to nested rule definitions
 */
export type NestedContext<
  E extends AnyElementSpecs<E> = EmptyElementSpecs,
  V extends string = never
> = {
  els: Selectors<E>;
  variant: VariantSelector<V>;
};

/**
 * Nested rule definitions keyed by selector
 */
export type NestedDefinitions = Record<string, Fragment>;

/**
 * A provider of nested styles
 */
export type NestedProvider<C extends NestedContext = NestedContext> = (
  s: FragmentFactory,
  ctx: C
) => NestedDefinitions;

/**
 * Replace selected fields in a component spec
 */
export type PatchComponentSpec<
  S extends AnyComponentSpec,
  U extends Partial<AnyComponentSpec>
> = Patch<AnyComponentSpec, S, U>;

/**
 * Replace selected fields in an element spec
 */
export type PatchElementSpec<
  S extends AnyElementSpec,
  U extends Partial<AnyElementSpec>
> = Patch<AnyElementSpec, S, U>;

/**
 * A mapping of selectors to nested blocks
 */
export type RuleBlock = {
  [selector: string]: Block;
};

/**
 * Resolve the selector type for an element spec
 */
type SelectorForSpec<S extends AnyElementSpec> = [
  keyof S['children']
] extends [never] ? string
  : S['children'] extends AnyElementSpecs<S['children']>
    ? ChildSelectors<S['children']>
  : never;

/**
 * Class selectors for a set of nested elements
 */
export type Selectors<E extends AnyElementSpecs<E> = EmptyElementSpecs> = {
  [K in keyof E]: SelectorForSpec<E[K]>;
};

/**
 * A mapping of CSS properties to values
 */
export type Styles<T extends string = string> = Record<T, Value>;

/**
 * A CSS value
 */
export type Value = number | string;

/**
 * Build a selector for one or more variants
 */
export type VariantSelector<V extends string> = <T extends V>(
  ...names: T[]
) => string;

/**
 * Styles for named variants
 */
export type VariantStyles<T extends string = string> = Record<T, Styles>;
