import type {
  IsFragmentFactory,
  Scope,
  ScopedFragments
} from './types/fragments.ts';

/**
 * Create a fragment factory
 */
function createFactory<T extends Scope>(scope: T): IsFragmentFactory<T> {
  const factory: IsFragmentFactory<T> = (styles = {}) => ({
    nested: definitions => {
      const nested = factory(styles);
      const scoped = { ...definitions };

      for (const fragment of Object.values(definitions)) {
        fragment.scope = 'relative';
      }

      nested.styles.nested = scoped as ScopedFragments<'relative'>;

      return nested;
    },
    scope,
    styles: {
      nested: {},
      root: styles
    }
  });

  return factory;
}

export const defineAbsoluteFragment = createFactory('absolute');
export const defineRelativeFragment = createFactory('relative');
