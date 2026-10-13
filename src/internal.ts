import type { Component } from './components.ts';
import type { CompileConfig } from './css.ts';
import type { AnyComponentSpec, AppliedWithInternal } from './types.ts';

// The key for the internal component build API
export const build = Symbol.for('ruscus/build');

/**
 * Data used to build a component's styles
 */
export type Buildable<S extends AnyComponentSpec> = {
  compile: (config?: CompileConfig) => string;
  component: Component<S>;
};

/**
 * Extract build data from a component
 */
export function extractBuildable<S extends AnyComponentSpec>(
  component: AppliedWithInternal<S>
): Buildable<S> {
  return component[build];
}
