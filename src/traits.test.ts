import { assert, describe, it } from 'vitest';

import { defineTrait, mergeTraits } from './traits.ts';

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

describe('mergeTraits', () => {
  it('merges root styles', () => {
    const styles = mergeTraits(
      defineTrait(s => s({ color: 'blue' })),
      defineTrait(s => s({ padding: '1em' }))
    );

    assert.deepEqual(styles.root, {
      color: 'blue',
      padding: '1em'
    });
  });

  it('merges nested styles', () => {
    const styles = mergeTraits(
      defineTrait(s => s().nested({ '&:focus': s({ outline: 'none' }) })),
      defineTrait(s =>
        s().nested({ '&:hover': s({ textDecoration: 'underline' }) })
      )
    );

    assert.deepEqual(
      styles.nested['&:focus']?.styles.root,
      { outline: 'none' }
    );

    assert.deepEqual(
      styles.nested['&:hover']?.styles.root,
      { textDecoration: 'underline' }
    );
  });

  it('returns empty styles when given no traits', () => {
    assert.deepEqual(mergeTraits().root, {});
    assert.deepEqual(mergeTraits().nested, {});
  });
});
