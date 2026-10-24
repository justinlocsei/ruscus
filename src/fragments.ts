import type {
  FragmentScope,
  IsFragmentFactory,
  ScopedFragments
} from './types/fragments.ts';

/**
 * Create a fragment factory
 */
function createFactory<T extends FragmentScope>(
  scope: T
): IsFragmentFactory<T> {
  const factory = ((styles = {}) => ({
    nested: definitions => {
      const nested = factory(styles);

      for (const fragment of Object.values(definitions)) {
        fragment.scope = 'relative';
      }

      nested.styles.nested = { ...definitions } as ScopedFragments<'relative'>;

      return nested;
    },
    scope,
    styles: {
      nested: {},
      root: styles
    }
  })) as IsFragmentFactory<T>;

  factory.rules = definitions => factory().nested(definitions);

  return factory;
}

export const defineAbsoluteFragment = createFactory('absolute');
export const defineRelativeFragment = createFactory('relative');
