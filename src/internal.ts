import type { Component } from './components.ts';
import type { CompileConfig } from './css.ts';
import type { AnyComponentSpec } from './types.ts';

// The key for the internal component build API
export const build = Symbol.for('ruscus/build');

/**
 * Data used to build a component's styles
 */
export type Buildable<S extends AnyComponentSpec> = {
  compile: (config?: CompileConfig) => string;
  component: Component<S>;
};
