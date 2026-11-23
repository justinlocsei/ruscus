import { defineRelativeFragment, mergeFragmentStyles } from './fragments.ts';
import type {
  Fragment,
  FragmentStyles,
  RelativeFragmentFactory
} from './types/fragments.ts';

/**
 * A trait that can be applied to a component or element
 */
export type Trait = Fragment<'relative'>;

/**
 * Merge traits into a collection of styles
 */
export function mergeTraits(...traits: Trait[]): FragmentStyles {
  return traits.reduce<FragmentStyles>(
    (previous, { styles }) => mergeFragmentStyles(previous, styles),
    { nested: {}, root: {} }
  );
}

/**
 * Define a trait
 */
export function defineTrait(
  build: (s: RelativeFragmentFactory) => Trait
): Trait {
  return build(defineRelativeFragment);
}
