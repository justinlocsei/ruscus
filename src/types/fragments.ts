import type { Styles } from './css.ts';

/**
 * A factory for absolute fragments
 */
export type AbsoluteFragmentFactory = IsFragmentFactory<'absolute'>;

/**
 * A provider of styles derived from a context
 */
export type DerivedStyles<
  S extends FragmentScope = 'relative',
  C extends object = object
> = (
  defineFragment: IsFragmentFactory<S>,
  context: C
) => ScopedFragments<S>;

/**
 * A styled fragment
 */
export type Fragment<S extends FragmentScope = FragmentScope> = {
  nested: (definitions: ScopedFragments) => Fragment<S>;
  scope: S;
  styles: FragmentStyles;
};

/**
 * The most inclusive form of a fragment factory
 */
export type FragmentFactory = IsFragmentFactory<FragmentScope>;

/**
 * The scope of a fragment
 */
export type FragmentScope = 'absolute' | 'relative';

/**
 * Styles bound to a fragment
 */
export type FragmentStyles = {
  nested: ScopedFragments<'relative'>;
  root: Styles;
};

/**
 * Define a scoped fragment factory
 */
export type IsFragmentFactory<S extends FragmentScope> =
  & ((styles?: Styles) => Fragment<S>)
  & { rules: (definitions: ScopedFragments) => Fragment<S> };

/**
 * A factory for absolute fragments
 */
export type RelativeFragmentFactory = IsFragmentFactory<'relative'>;

/**
 * Fragment definitions scoped by selector
 */
export type ScopedFragments<S extends FragmentScope = FragmentScope> = Record<
  string,
  Fragment<S>
>;
