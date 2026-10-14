import type { AnyComponent } from './components.ts';
import type { CompileConfig } from './css.ts';
import type { AnyComponentSpec } from './types/components.ts';
import type { ApplicableComponent } from './types/projection.ts';

// The key for a component's build plan
export const buildPlan = Symbol.for('ruscus/build');

/**
 * An applicable component that includes a build plan
 */
export type BuildableComponent<S extends AnyComponentSpec> =
  & ApplicableComponent<S>
  & { [buildPlan]: BuildPlan };

/**
 * A build plan for a component
 */
export type BuildPlan = {
  compile: (config?: CompileConfig) => string;
  component: AnyComponent;
};

/**
 * Extract a build plan from a component
 */
export function extractBuildPlan(
  component: BuildableComponent<AnyComponentSpec>
): BuildPlan {
  return component[buildPlan];
}
