/**
 * A generic shape for nested selectors
 */
export type AnySelectors = {
  [name: string]: AnySelectors | string;
};

/**
 * A block containing either declarations or nested rules
 */
export type Block = Declarations | RuleBlock;

/**
 * CSS declarations in a nested rule block
 */
export type Declarations = {
  [property: string]: Value | undefined;
};

/**
 * A mapping of selectors to nested blocks
 */
export type RuleBlock = {
  [selector: string]: Block;
};

/**
 * A mapping of CSS properties to values
 */
export type Styles<T extends string = string> = Record<T, Value>;

/**
 * A CSS value
 */
export type Value = number | string;
