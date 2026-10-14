import type { AnyComponent } from './components.ts';
import type { CompileConfig } from './css.ts';
import type {
  AnyComponentSpec,
  IdentifierValuesFor
} from './types/components.ts';
import type { ApplicableComponent } from './types/projection.ts';

const build = Symbol.for('ruscus/build');
const identifiers = Symbol.for('ruscus/identifiers');

/**
 * Internal annotations for a component
 */
type Annotations<S extends AnyComponentSpec> = {
  [build]: BuildPlan;
  [identifiers]: IdentifierValuesFor<S>;
};

/**
 * An applicable component that includes internal annotations
 */
export type InternalComponent<S extends AnyComponentSpec> =
  & ApplicableComponent<S>
  & Annotations<S>;

/**
 * A build plan for a component
 */
export type BuildPlan = {
  compile: (config?: CompileConfig) => string;
  component: AnyComponent;
};

/**
 * Apply internal annotations to a component
 */
export function annotateComponent<S extends AnyComponentSpec>(
  component: ApplicableComponent<S>,
  annotations: {
    buildPlan: BuildPlan;
    identifiers: IdentifierValuesFor<S>;
  }
): InternalComponent<S> {
  const props: Annotations<S> = {
    [build]: annotations.buildPlan,
    [identifiers]: annotations.identifiers
  };

  for (const [key, value] of Object.entries(props)) {
    Object.defineProperty(component, key, {
      configurable: false,
      enumerable: false,
      value,
      writable: false
    });
  }

  return component as InternalComponent<S>;
}

/**
 * Extract a build plan from a component
 */
export function extractBuildPlan(
  component: InternalComponent<AnyComponentSpec>
): BuildPlan {
  return component[build];
}

/**
 * Extract identifiers from a component
 */
export function extractIdentifiers<S extends AnyComponentSpec>(
  component: InternalComponent<S>
): IdentifierValuesFor<S> {
  return component[identifiers];
}
