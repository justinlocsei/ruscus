import { CompactNaming } from './naming/compact.ts';
import type { Naming } from './naming/shared.ts';
import { VerboseNaming } from './naming/verbose.ts';
import type { ComponentDefinition } from './types/components.ts';

declare const __RUSCUS_NAMING__: NamingScheme | undefined;

/**
 * A generator for class and variant names
 */
export type NameGenerator = Naming;

/**
 * An available naming scheme for classes
 */
export type NamingScheme = 'compact' | 'verbose';

/**
 * Create a name generator for a component
 */
export function useNaming(
  component: ComponentDefinition,
  scheme?: NamingScheme
): NameGenerator {
  /* c8 ignore next 3 -- Vite replaces this build-time constant */
  const naming = scheme ?? (
    typeof __RUSCUS_NAMING__ === 'undefined'
      ? 'verbose'
      : __RUSCUS_NAMING__
  );

  return naming === 'compact'
    ? new CompactNaming(component)
    : new VerboseNaming(component);
}
