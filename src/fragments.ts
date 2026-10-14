import type { IsFragmentFactory, Scope } from './types/fragments.ts';

/**
 * Create a fragment factory
 */
function createFactory<T extends Scope>(scope: T): IsFragmentFactory<T> {
  const factory: IsFragmentFactory<T> = (styles = {}) => ({
    nested: definitions => {
      const nested = factory(styles);
      nested.styles.nested = definitions;

      return {
        ...nested,
        scope: 'relative'
      };
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
