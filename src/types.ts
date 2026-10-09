import type { Patch } from './types/utils.ts';

/**
 * An empty set of named elements
 */
export type BareElements = { [K in never]: never };

/**
 * A specification for an element
 */
export type ElementSpec<
  E extends NamedElements = BareElements,
  V extends string = never
> = {
  children: E;
  variants: V;
};

/**
 * The most inclusive form of an element spec
 */
export type AnyElementSpec = ElementSpec<NamedElements, string>;

/**
 * Replace selected fields in an element spec
 */
export type PatchElementSpec<
  S extends AnyElementSpec,
  U extends Partial<AnyElementSpec>
> = Patch<AnyElementSpec, S, U>;

/**
 * A collection of named element specs
 */
export type NamedElements<T extends string = string> = {
  [K in T]: ElementSpec<NamedElements | BareElements, string>;
};

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends NamedElements = BareElements,
  V extends string = never
> = {
  els: E;
  variants: V;
};

/**
 * The most inclusive form of a component spec
 */
export type AnyComponentSpec = ComponentSpec<NamedElements, string>;

/**
 * Replace selected fields in a component spec
 */
export type PatchComponentSpec<
  S extends AnyComponentSpec,
  U extends Partial<AnyComponentSpec>
> = Patch<AnyComponentSpec, S, U>;

/**
 * A CSS value
 */
export type Value = number | string;

/**
 * A block containing either styles or a deeper block
 */
export type Block = RuleBlock | Styles;

/**
 * A mapping of CSS properties to values
 */
export type Styles<T extends string = string> = Record<T, Value>;

/**
 * A mapping of selectors to nested blocks
 */
export type RuleBlock = {
  [selector: string]: Block;
};

/**
 * Styles for named variants
 */
export type VariantStyles<T extends string = string> = Record<T, Styles>;
