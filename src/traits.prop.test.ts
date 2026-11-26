import { fc, test } from '@fast-check/vitest';
import { assert } from 'vitest';

import { declarations } from './tests/properties/styles.ts';
import { defineTrait, mergeTraits } from './traits.ts';

test.prop([fc.array(declarations, { maxLength: 5 })])(
  'trait merging accepts arbitrary lists of traits',
  roots => {
    const traits = roots.map(root => defineTrait(s => s(root)));

    assert.doesNotThrow(() => mergeTraits(...traits));
  }
);
