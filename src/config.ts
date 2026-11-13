import type { NamingScheme } from './naming.ts';

/**
 * Ruscus configuration options
 */
export type ConfigOptions = {
  naming?: NamingScheme;
};

/**
 * The ID of an option
 */
type Option = keyof ConfigOptions;

/**
 * Get the value for an option
 */
type ValueFor<O extends Option> = NonNullable<ConfigOptions[O]>;

class Configuration {
  private values: Partial<ConfigOptions> = {};

  /**
   * Read a configuration value
   */
  get<O extends Option>(
    key: O,
    fallback: ValueFor<O>
  ): ValueFor<O> {
    return this.values[key] ?? fallback;
  }

  /**
   * Clear all configuration values
   */
  reset(): void {
    this.values = {};
  }

  /**
   * Merge configuration values
   */
  set(options: Partial<ConfigOptions>): void {
    this.values = { ...this.values, ...options };
  }
}

const config = new Configuration();

/**
 * Set global configuration
 */
export function configure(options: Partial<ConfigOptions>): void {
  config.set(options);
}

export default config;
