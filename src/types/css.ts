import type { KnownStyleProperties } from './css/properties.ts';
import type { Value } from './css/values.ts';

/**
 * CSS declarations in a nested rule block
 */
export type Declarations = {
  [property: string]: Value | undefined;
};

/**
 * A mapping of CSS properties to values
 */
export type Styles = KnownStyleProperties & Record<string, Value | undefined>;
