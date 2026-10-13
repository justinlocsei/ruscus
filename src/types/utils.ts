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

/**
 * Replace selected fields in an object
 */
export type Patch<
  Base extends object,
  S extends Base,
  U extends Partial<Base>
> = Omit<S, keyof U> & U;
