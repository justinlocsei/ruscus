import type { NameGenerator } from '../naming.ts';
import { asProperty } from '../styles.ts';
import type {
  AnyDerivedContext,
  AnyVariantsContext,
  ComponentDefinition,
  ContextIdentifiers
} from '../types/components.ts';
import { buildElementSelectors, buildVariantSelector } from './elements.ts';

/**
 * Build identifiers for use in context
 */
function buildContextIdentifiers(
  component: ComponentDefinition
): ContextIdentifiers<string> {
  const ids = Object.fromEntries(
    Object.entries(component.identifiers).map(([name, type]) => {
      const scoped = `${component.id}--${asProperty(name)}`;

      return [
        name,
        type === 'variable' ? `--${scoped}` : scoped
      ];
    })
  );

  return { ids };
}

/**
 * Build a derived context for component styles
 */
export function buildDerivedContext(
  component: ComponentDefinition,
  {
    anchor = '&',
    name
  }: {
    anchor?: string;
    name: NameGenerator;
  }
): AnyDerivedContext {
  const namespace = [component.id];

  return {
    els: buildElementSelectors(namespace, component.elements, { name }),
    variants: buildVariantSelector(anchor),
    ...buildContextIdentifiers(component)
  };
}

/**
 * Build a variants context for component styles
 */
export function buildComponentVariantsContext(
  component: ComponentDefinition,
  name: NameGenerator
): AnyVariantsContext {
  return {
    els: buildElementSelectors([component.id], component.elements, { name }),
    ...buildContextIdentifiers(component)
  };
}
