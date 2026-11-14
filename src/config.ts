declare const __RUSCUS_CONFIG__: ConfigOptions | undefined;

/**
 * An available naming scheme for classes
 */
export type NamingScheme = 'compact' | 'verbose';

/**
 * Ruscus configuration options
 */
export type ConfigOptions = {
  naming?: NamingScheme;
  prefix?: string;
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
  private injected: ConfigOptions;
  private values: ConfigOptions = {};

  /**
   * Create a configuration manager
   */
  constructor() {
    /* c8 ignore next -- Build plugins replace this constant */
    this.injected = typeof __RUSCUS_CONFIG__ === 'undefined'
      ? {}
      : __RUSCUS_CONFIG__;
  }

  /**
   * Read a configuration value
   */
  get<O extends Option>(
    key: O,
    fallback: ValueFor<O>
  ): ValueFor<O> {
    return this.injected[key] ?? this.values[key] ?? fallback;
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
