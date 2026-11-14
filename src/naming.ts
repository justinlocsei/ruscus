import type { Configuration } from './config.ts';
import globalConfig from './config.ts';
import { CompactNaming } from './naming/compact.ts';
import type { Naming } from './naming/shared.ts';
import { VerboseNaming } from './naming/verbose.ts';
import type { ComponentDefinition } from './types/components.ts';

/**
 * A generator for class and variant names
 */
export type NameGenerator = Naming;

/**
 * Create a name generator for a component
 */
export function useNaming(
  component: ComponentDefinition,
  config: Configuration = globalConfig
): NameGenerator {
  const naming = config.get('naming', 'verbose');
  const prefix = config.get('prefix', '');

  return naming === 'compact'
    ? new CompactNaming(component, prefix)
    : new VerboseNaming(component, prefix);
}
