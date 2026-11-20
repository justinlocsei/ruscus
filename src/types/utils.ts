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
 * Require a subset of fields in an object
 */
export type Require<T extends object, K extends keyof T> =
  & Omit<T, K>
  & Required<Pick<T, K>>;

/**
 * An eager value or a function that produces one
 */
export type Thunkable<T> = T | (() => T);
