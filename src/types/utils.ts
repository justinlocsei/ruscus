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
 * Convert a string to kebab case
 */
export type ToKebabCase<T extends string, A extends string = ''> = T extends
  `${infer F}${infer R}`
  ? ToKebabCase<R, `${A}${F extends Lowercase<F> ? '' : '-'}${Lowercase<F>}`>
  : A;

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
