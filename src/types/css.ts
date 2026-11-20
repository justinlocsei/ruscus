import type {
  KnownProperties,
  PropertyName as Property
} from './css/properties.ts';
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
export type Styles = KnownProperties & Record<string, Value | undefined>;

/**
 * A known CSS property usable as a key in style definitions
 */
export type KnownProperty = keyof KnownProperties;

/**
 * A CSS property name
 */
export type PropertyName = Property;
