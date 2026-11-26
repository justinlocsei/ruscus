import { fc } from '@fast-check/vitest';

import { defineRelativeFragment } from '../../fragments.ts';
import type { Fragment, FragmentStyles } from '../../types/fragments.ts';
import { nestedSelectorKey } from './selectors.ts';
import { declarations } from './styles.ts';

/**
 * Generate a nested relative fragment
 */
function fragment(depth: number): fc.Arbitrary<Fragment<'relative'>> {
  const nested = depth === 0
    ? fc.constant({})
    : fc.array(
      fc.tuple(nestedSelectorKey, fragment(depth - 1)),
      { maxLength: 4 }
    ).map(entries => Object.fromEntries(entries));

  return fc.record({
    nested,
    root: declarations
  }).map(({ nested, root }) => defineRelativeFragment(root).nested(nested));
}

/**
 * Generate fragment styles
 */
export function fragmentStyles(
  depth = 2
): fc.Arbitrary<FragmentStyles> {
  return fragment(depth).map(value => value.styles);
}
