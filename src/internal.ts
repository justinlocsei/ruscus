import type { CompileConfig } from './compilation.ts';
import type {
  AnyComponentSpec,
  ComponentDefinition,
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
  component: ComponentDefinition;
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
  const annotate = <K extends keyof Annotations<S>>(
    key: K,
    value: Annotations<S>[K]
  ) => {
    Object.defineProperty(component, key, {
      configurable: false,
      enumerable: false,
      value,
      writable: false
    });
  };

  annotate(build, annotations.buildPlan);
  annotate(identifiers, annotations.identifiers);

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
