import { assert, describe, it } from 'vitest';

import { defineAbsoluteFragment, defineRelativeFragment } from './fragments.ts';
import { defineTrait } from './traits.ts';
import type { FragmentFactory } from './types/fragments.ts';

function testFactory(fragment: FragmentFactory) {
  it('uses an empty state by default', () => {
    assert.deepEqual(fragment().styles, {
      nested: {},
      root: {}
    });
  });

  it('applies CSS declarations', () => {
    assert.deepEqual(
      fragment({ color: 'red' }).styles.root,
      { color: 'red' }
    );
  });

  it('registers nested fragments', () => {
    const styled = fragment({ color: 'red' }).nested({
      '&:hover': fragment({ opacity: '0.5' })
    });

    const nested = styled.styles.nested['&:hover'];
    assert.isDefined(nested, 'nested fragment not registered');

    assert.equal(nested.scope, 'relative');

    assert.deepEqual(
      nested.styles.root,
      { opacity: '0.5' }
    );
  });

  it('registers nested fragments via rules', () => {
    const styled = fragment.rules({
      from: fragment({ opacity: 0 }),
      to: fragment({ opacity: 1 })
    });

    assert.deepEqual(styled.styles.root, {});

    const from = styled.styles.nested.from;
    assert.isDefined(from);

    assert.deepEqual(from.styles.root, { opacity: 0 });
  });

  it('applies a trait to a fragment', () => {
    const styled = fragment({ color: 'red' }).is(
      defineTrait(s => s({ padding: '1rem' }))
    );

    assert.deepEqual(styled.styles.root, {
      color: 'red',
      padding: '1rem'
    });
  });

  it('supports plucked fragment methods', () => {
    const base = fragment({ color: 'red' });
    const { is } = base;

    const styled = is(defineTrait(s => s({ padding: '1rem' })));

    assert.deepEqual(styled.styles.root, {
      color: 'red',
      padding: '1rem'
    });
  });

  it('merges nested trait styles', () => {
    const styled = fragment({ color: 'red' }).nested({
      '&:hover': fragment({ opacity: '0.5' })
    }).is(
      defineTrait(s =>
        s().nested({
          '&:hover': s({ textDecoration: 'underline' })
        })
      )
    );

    assert.deepEqual(styled.styles.nested['&:hover']?.styles.root, {
      opacity: '0.5',
      textDecoration: 'underline'
    });
  });

  it('merges nested styles from a fragment into a trait', () => {
    const styled = fragment({ color: 'red' }).is(
      defineTrait(s =>
        s().nested({
          '&:hover': s({ textDecoration: 'underline' })
        })
      )
    ).nested({
      '&:hover': fragment({ opacity: '0.5' })
    });

    assert.deepEqual(styled.styles.nested['&:hover']?.styles.root, {
      opacity: '0.5',
      textDecoration: 'underline'
    });
  });

  it('preserves nested trait styles when adding nested styles', () => {
    const styled = fragment().is(
      defineTrait(s =>
        s().nested({
          '&:hover': s({ opacity: '0.5' })
        })
      )
    ).nested({
      '&:focus': fragment({ outline: 'none' })
    });

    assert.deepEqual(Object.keys(styled.styles.nested), [
      '&:hover',
      '&:focus'
    ]);
  });
}

describe('defineAbsoluteFragment', () => {
  it('creates an absolute fragment', () => {
    assert.equal(defineAbsoluteFragment().scope, 'absolute');
  });

  testFactory(defineAbsoluteFragment);
});

describe('defineRelativeFragment', () => {
  it('creates a relative fragment', () => {
    assert.equal(defineRelativeFragment().scope, 'relative');
  });

  testFactory(defineRelativeFragment);
});
