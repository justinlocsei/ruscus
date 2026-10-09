import type { Patch, Thunkable } from './types/utils.ts';

export const ELEMENT_ROOT = 'root';

/**
 * The most inclusive form of a component spec
 */
export type AnyComponentSpec = ComponentSpec<ElementSpecs, string>;

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
 * A block containing either styles or a deeper block
 */
export type Block = RuleBlock | Styles;

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends ElementSpecs = EmptyElementSpecs,
  V extends string = never
> = {
  els: E;
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
 * The context available to nested rule definitions
 */
export type NestedContext<E extends AnyElementSpecs<E> = EmptyElementSpecs> = {
  els: Selectors<E>;
};

/**
 * A provider of nested styles
 */
export type NestedProvider<E extends AnyElementSpecs<E> = EmptyElementSpecs> =
  | Thunkable<RuleBlock>
  | ((ctx: NestedContext<E>) => RuleBlock);

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
  [selector: string]: RuleBlock | Declarations;
};

/**
 * Resolve the selector type for an element spec
 */
type SelectorForSpec<S extends AnyElementSpec> = [
  keyof S['children']
] extends [never] ? string
  : S['children'] extends AnyElementSpecs<S['children']>
    ? { [ELEMENT_ROOT]: string } & Selectors<S['children']>
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
 * Styles for named variants
 */
export type VariantStyles<T extends string = string> = Record<T, Styles>;
