import { defineRelativeFragment } from './fragments.ts';
import { mergeStyles } from './styles.ts';
import type { Styles } from './types/css.ts';
import type { NestedProvider } from './types/elements.ts';
import type { Fragment, RelativeFragmentFactory } from './types/fragments.ts';

/**
 * A trait that can be applied to a target
 */
export type Trait = Fragment<'relative'>;

/**
 * A target to which traits can be applied
 */
type Target = {
  nested: NestedProvider[];
  styles: Styles;
};

/**
 * Apply a trait's styles to a target
 */
export function applyTrait(
  target: Target,
  { styles }: Trait
): void {
  target.styles = mergeStyles(target.styles, styles.root);

  if (Object.keys(styles.nested).length > 0) {
    target.nested.push(() => styles.nested);
  }
}

/**
 * Define a trait
 */
export function defineTrait(
  build: (s: RelativeFragmentFactory) => Trait
): Trait {
  return build(defineRelativeFragment);
}
