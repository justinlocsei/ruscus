import { test } from '@fast-check/vitest';
import { assert } from 'vitest';

import { mergeFragmentStyles } from './fragments.ts';
import { fragmentStyles } from './tests/properties/fragments.ts';

test.prop([
  fragmentStyles(),
  fragmentStyles(),
  fragmentStyles()
])(
  'the merging of fragment styles is associative',
  (alfa, bravo, charlie) => {
    assert.deepEqual(
      mergeFragmentStyles(mergeFragmentStyles(alfa, bravo), charlie),
      mergeFragmentStyles(alfa, mergeFragmentStyles(bravo, charlie))
    );
  }
);
