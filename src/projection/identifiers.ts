import { asIdentifier } from '../styles.ts';
import type {
  ComponentDefinition,
  IdentifierValues
} from '../types/components.ts';

/**
 * Project a component's identifiers as a map of labels to values
 */
export function projectIdentifiers(
  component: ComponentDefinition
): IdentifierValues<string> {
  return Object.fromEntries(
    Object.entries(component.identifiers).map(([key, type]) => {
      const scoped = `${component.id}--${asIdentifier(key)}`;

      return [
        key,
        type === 'variable' ? `--${scoped}` : scoped
      ];
    })
  ) as IdentifierValues<string>;
}
