/**
 * A specification for an element
 */
export type ElementSpec<
  E extends NamedElements = never
> = {
  children?: E;
};

/**
 * A collection of named element specs
 */
export type NamedElements<T extends string = string> = Record<T, ElementSpec>;

/**
 * A component with no registered elements
 */
export type NoElements = Record<string, never>;

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
