import type { Patch } from './types/utils.ts';

/**
 * The most inclusive form of a component spec
 */
export type AnyComponentSpec = ComponentSpec<ElementSpecs, string>;

/**
 * The most inclusive form of an element spec
 */
export type AnyElementSpec = ElementSpec<ElementSpecs, string>;

/**
 * An empty set of named elements
 */
export type BareElements = { [K in never]: never };

/**
 * A block containing either styles or a deeper block
 */
export type Block = RuleBlock | Styles;

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends ElementSpecs = BareElements,
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
  E extends ElementSpecs = BareElements,
  V extends string = never
> = {
  children: E;
  variants: V;
};

/**
 * A collection of named element specs
 */
export type ElementSpecs<T extends string = string> = {
  [K in T]: ElementSpec<ElementSpecs | BareElements, string>;
};

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
