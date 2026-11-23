import { mergeStyles } from './styles.ts';
import type {
  Fragment,
  FragmentScope,
  FragmentStyles,
  IsFragmentFactory,
  ScopedFragments
} from './types/fragments.ts';

/**
 * Merge fragment styles recursively
 */
export function mergeFragmentStyles(
  left: FragmentStyles,
  right: FragmentStyles
): FragmentStyles {
  const nested = { ...left.nested };

  for (const [key, fragment] of Object.entries(right.nested)) {
    const previous = nested[key];

    nested[key] = previous
      ? {
        ...previous,
        styles: mergeFragmentStyles(previous.styles, fragment.styles)
      }
      : fragment;
  }

  return {
    nested,
    root: mergeStyles(left.root, right.root)
  };
}

/**
 * Merge successive traits into fragment styles
 */
function mergeTraitStyles(
  styles: FragmentStyles,
  ...traits: Fragment<'relative'>[]
): FragmentStyles {
  return traits.reduce(
    (previous, { styles: traitStyles }) =>
      mergeFragmentStyles(previous, traitStyles),
    styles
  );
}

/**
 * Create a fragment
 */
function createFragment<T extends FragmentScope>(
  factory: IsFragmentFactory<T>,
  scope: T,
  styles: FragmentStyles
): Fragment<T> {
  let fragment!: Fragment<T>;

  fragment = {
    is(...traits: Fragment<'relative'>[]) {
      return createFragment(
        factory,
        scope,
        mergeTraitStyles(fragment.styles, ...traits)
      );
    },
    nested(definitions) {
      for (const child of Object.values(definitions)) {
        child.scope = 'relative';
      }

      return createFragment(
        factory,
        scope,
        mergeFragmentStyles(fragment.styles, {
          nested: definitions as ScopedFragments<'relative'>,
          root: {}
        })
      );
    },
    scope,
    styles
  };

  return fragment;
}

/**
 * Create a fragment factory
 */
function createFactory<T extends FragmentScope>(
  scope: T
): IsFragmentFactory<T> {
  const factory = ((root = {}) =>
    createFragment(factory, scope, {
      nested: {},
      root
    })) as IsFragmentFactory<T>;

  factory.rules = definitions => factory().nested(definitions);

  return factory;
}

export const defineAbsoluteFragment = createFactory('absolute');
export const defineRelativeFragment = createFactory('relative');
