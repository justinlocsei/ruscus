import { assert, describe, it } from 'vitest';

import { defineFragment, Fragment } from './fragments.ts';

describe('defineFragment', () => {
  it('creates a fragment without initial styles', () => {
    assert.deepEqual(defineFragment().current.styles, {});
  });
});

describe('Fragment', () => {
  it('uses an empty state by default', () => {
    assert.deepEqual(new Fragment().current, {
      nested: {},
      styles: {}
    });
  });

  it('applies CSS declarations', () => {
    assert.deepEqual(
      defineFragment({ color: 'red' }).current.styles,
      { color: 'red' }
    );
  });

  it('merges CSS declarations', () => {
    assert.deepEqual(
      defineFragment({ color: 'red' }).css({ opacity: '0.5' }).current.styles,
      { color: 'red', opacity: '0.5' }
    );
  });

  it('registers nested fragments', () => {
    const fragment = defineFragment({ color: 'red' }).nested({
      '&:hover': defineFragment({ opacity: '0.5' })
    });

    assert.deepEqual(
      fragment.current.nested['&:hover']?.current.styles,
      { opacity: '0.5' }
    );
  });

  it('throws when nested rules are defined more than once', () => {
    const fragment = defineFragment().nested({
      a: defineFragment({ color: 'red' })
    });

    assert.throws(
      () => fragment.nested({ b: defineFragment() }),
      'nested may only be called once'
    );
  });
});
