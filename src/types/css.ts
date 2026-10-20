/**
 * CSS declarations in a nested rule block
 */
export type Declarations = {
  [property: string]: Value | undefined;
};

/**
 * A mapping of CSS properties to values
 */
export type Styles<T extends string = string> = Record<T, Value>;

/**
 * A CSS value
 */
export type Value = number | string;
