import { CompactNaming } from './naming/compact.ts';
import { VerboseNaming } from './naming/verbose.ts';
import type { ComponentDefinition } from './types/components.ts';

/**
 * A generator for class names
 */
export type NameGenerator = (levels: string[]) => string;

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
  const name = scheme === 'compact'
    ? new CompactNaming(component)
    : new VerboseNaming(component);

  return levels => name.forClass(levels);
}
