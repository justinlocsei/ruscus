/**
 * An empty set of named elements
 */
export type BareElements = Record<string, never>;

/**
 * A specification for an element
 */
export type ElementSpec<
  E extends NamedElements = BareElements
> = {
  children: E;
};

/**
 * A collection of named element specs
 */
export type NamedElements<T extends string = string> = Record<T, ElementSpec>;

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends NamedElements = BareElements
> = {
  els: E;
};

/**
 * A mapping of CSS properties to values
 */
export type Styles<T extends string = string> = Record<T, string | undefined>;
