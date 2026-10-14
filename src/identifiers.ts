import type {
  IdentifiersContext,
  NamedIdentifiers
} from './types/components.ts';

export { ELEMENT_ROOT } from './types/ids.ts';

/**
 * Project a camelCase style property to a CSS property name
 */
export function asProperty(camelCase: string): string {
  return camelCase.replace(
    /[A-Z]/g,
    letter => `-${letter.toLowerCase()}`
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
