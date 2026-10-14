import type {
  IdentifiersContext,
  NamedIdentifiers
} from './types/components.ts';

export { ELEMENT_ROOT } from './types/ids.ts';

/**
 * Project a camel-cased value as a CSS property name
 */
export function asProperty(camel: string): string {
  return camel.replace(
    /[A-Z]/g,
    l => `-${l.toLowerCase()}`
  );
}

/**
 * Build the identifiers available while defining component styles
 */
export function buildIdentifiersContext<I extends NamedIdentifiers>(
  scope: string,
  spec: I
): IdentifiersContext<I> {
  const ids = Object.fromEntries(
    Object.entries(spec).map(([name, type]) => {
      const scoped = `${scope}--${asProperty(name)}`;

      return [
        name,
        type === 'variable' ? `--${scoped}` : scoped
      ];
    })
  );

  return { ids } as IdentifiersContext<I>;
}
