import { assert, describe, it } from 'vitest';

import { defineTrait } from './traits.ts';

describe('defineTrait', () => {
  it('resolves to a relative fragment', () => {
    const link = defineTrait(s =>
      s({ color: 'blue' }).nested({
        '&:hover': s({ textDecoration: 'underline' })
      })
    );

    assert.deepEqual(link.styles.root, { color: 'blue' });

    assert.deepEqual(
      link.styles.nested['&:hover']?.styles.root,
      { textDecoration: 'underline' }
    );
  });
});
