import type { Fragment, RelativeFragmentFactory } from './fragments.ts';
import { defineRelativeFragment } from './fragments.ts';
import { mergeStyles } from './styles.ts';
import type { NestedDefinitions, NestedProvider, Styles } from './types.ts';

/**
 * A reusable bundle of styles and optional nested rules
 */
export type Trait = (
  s: RelativeFragmentFactory
) => Fragment<'relative'>;

/**
 * Define a trait from a fragment factory callback
 */
export function defineTrait(build: Trait): Trait {
  return build;
}

/**
 * Resolve a trait to a fragment
 */
export function resolveTrait(trait: Trait): Fragment<'relative'> {
  return trait(defineRelativeFragment);
}

/**
 * A target for trait styles and nested providers
 */
export type TraitTarget = {
  nested: NestedProvider[];
  styles: Styles;
};

/**
 * Apply a trait's styles and nested rules to a style target
 */
export function applyTrait(
  target: TraitTarget,
  trait: Trait
): void {
  const fragment = resolveTrait(trait);

  target.styles = mergeStyles(target.styles, fragment.current.styles);

  const { nested } = fragment.current;

  if (Object.keys(nested).length > 0) {
    target.nested.push(
      nestedProviderFrom(nested as NestedDefinitions)
    );
  }
}

/**
 * Build a nested provider from eager definitions
 */
export function nestedProviderFrom(
  definitions: NestedDefinitions
): NestedProvider {
  return () => definitions;
}
