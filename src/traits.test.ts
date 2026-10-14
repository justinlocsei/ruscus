import { assert, describe, it } from 'vitest';

import type { HasTraits } from './traits.ts';
import { applyTraits, defineTrait } from './traits.ts';

describe('applyTraits', () => {
  it('applies traits to a target', () => {
    const target: HasTraits = { styles: {}, nested: [] };

    const traits = [
      defineTrait(s => s({ color: 'blue' })),
      defineTrait(s =>
        s({ padding: '1em' }).nested({
          '&:hover': s({ textDecoration: 'underline' })
        })
      )
    ];

    applyTraits(target, traits);

    assert.deepEqual(target.styles, {
      color: 'blue',
      padding: '1em'
    });

    assert.isFunction(target.nested[0]);
  });
});

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
