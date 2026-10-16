/**
 * A builder's internal state
 */
type State = Record<string, unknown>;

/**
 * The exposed state of a builder
 */
export type BuilderState<T extends State> = {
  current: T;
};

export default abstract class Builder<T extends State> {
  current: T;

  /**
   * Create a builder that progressively updates its state
   */
  constructor(defaultState: T) {
    this.current = defaultState;
  }

  /**
   * Set a state field
   *
   * @throws if the field already has a value
   */
  protected setStateField<K extends Extract<keyof T, string>>(
    key: K,
    value: T[K]
  ): void {
    const current = this.current[key];

    if (current !== undefined) {
      const isSet = typeof current === 'object'
        ? Object.keys(current as object).length > 0
        : true;

      if (isSet) {
        throw new Error(`${key} may only be set once`);
      }
    }

    this.current[key] = value;
  }
}
