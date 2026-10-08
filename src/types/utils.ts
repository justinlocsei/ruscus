/**
 * Replace selected fields in an object
 */
export type Patch<
  Base extends object,
  S extends Base,
  U extends Partial<Base>
> = Omit<S, keyof U> & U;
