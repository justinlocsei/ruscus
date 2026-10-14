import { assert, describe, it } from 'vitest';

import { defineAbsoluteFragment, defineRelativeFragment } from './fragments.ts';
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
