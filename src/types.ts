/**
 * A specification for an element
 */
export type ElementSpec<
  E extends NamedElements = never
>= {
  children?: E;
}

/**
 * A collection of named elements
 */
export type NamedElements<T extends string = string> = Record<T, ElementSpec>;

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends NamedElements = never
>= {
  els: E;
}

/**
 * A mapping of CSS properties to values
 */
export type Styles<T extends string = string> = Record<T, string | undefined>;
