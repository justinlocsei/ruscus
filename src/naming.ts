import { CompactNaming } from './naming/compact.ts';
import type { Naming } from './naming/shared.ts';
import { VerboseNaming } from './naming/verbose.ts';
import type { ComponentDefinition } from './types/components.ts';

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
  scheme: NamingScheme = 'verbose'
): NameGenerator {
  return scheme === 'compact'
    ? new CompactNaming(component)
    : new VerboseNaming(component);
}
