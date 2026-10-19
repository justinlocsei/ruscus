/**
 * An object without keys
 */
export type EmptyObject = { [K in never]: never };

/**
 * A type that has variants
 */
export type HasVariants<T extends string> = {
  variants: T;
};

/**
 * An eager value or a function that produces one
 */
export type Thunkable<T> = T | (() => T);
