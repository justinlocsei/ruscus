import type { Styles } from './css.ts';

/**
 * A factory for absolute fragments
 */
export type AbsoluteFragmentFactory = IsFragmentFactory<'absolute'>;

/**
 * A provider of fragments derived from a context
 */
export type DerivedFragmentProvider<
  C extends object,
  S extends Scope
> = (
  defineFragment: IsFragmentFactory<S>,
  context: C
) => ScopedFragments<S>;

/**
 * A styled fragment
 */
export type Fragment<S extends Scope = Scope> = {
  nested: (definitions: ScopedFragments) => Fragment<S>;
  scope: S;
  styles: FragmentStyles;
};

/**
 * The most inclusive form of a fragment factory
 */
export type FragmentFactory = IsFragmentFactory<Scope>;

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
export type IsFragmentFactory<S extends Scope> = (
  styles?: Styles
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
