import type { Styles } from './css.ts';

/**
 * A factory for absolute fragments
 */
export type AbsoluteFragmentFactory = IsFragmentFactory<'absolute'>;

/**
 * A styled fragment
 */
export type Fragment<S extends Scope = Scope> = {
  nested: (definitions: ScopedFragments<S>) => Fragment<S>;
  scope: S;
  styles: FragmentStyles<S>;
};

/**
 * Styles bound to a fragment
 */
export type FragmentStyles<S extends Scope> = {
  nested: ScopedFragments<S>;
  root: Styles;
};

/**
 * Define a scoped fragment factory
 */
export type IsFragmentFactory<S extends Scope> = (
  styles: Styles
) => Fragment<S>;

/**
 * A factory for absolute fragments
 */
export type RelativeFragmentFactory = IsFragmentFactory<'relative'>;

/**
 * The scope of a fragment
 */
export type Scope = 'absolute' | 'relative';

/**
 * Fragment definitions scoped by selector
 */
export type ScopedFragments<S extends Scope = Scope> = Record<
  string,
  Fragment<S>
>;
