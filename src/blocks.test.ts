import { assert, describe, it } from 'vitest';

import {
  buildNestedContext,
  isStyles,
  resolveNestedProvider
} from './blocks.ts';

describe('buildNestedContext', () => {
  it('maps child slots to class selectors', () => {
    assert.deepEqual(
      buildNestedContext(['card', 'body'], ['title']),
      { els: { title: '.card__body__title' } }
    );
  });
});

describe('isStyles', () => {
  it('accepts declaration blocks', () => {
    assert.equal(isStyles({ color: 'red', opacity: 1 }), true);
  });

  it('rejects nested selector blocks', () => {
    assert.equal(isStyles({ title: { color: 'red' } }), false);
  });
});

describe('resolveNestedProvider', () => {
  it('returns eager definitions', () => {
    const block = { '&:hover': { opacity: '0.5' } };

    assert.strictEqual(
      resolveNestedProvider(block, { els: {} }),
      block
    );
  });

  it('resolves contextual definitions', () => {
    const ctx = buildNestedContext(['card', 'body'], ['title']);

    assert.deepEqual(
      resolveNestedProvider(({ els }) => {
        const title = els.title;

        if (title === undefined) {
          throw new Error('expected a title');
        }

        return { [title]: { color: 'red' } };
      }, ctx),
      { '.card__body__title': { color: 'red' } }
    );
  });

  it('resolves lazy definitions', () => {
    assert.deepEqual(
      resolveNestedProvider(() => ({ '&:hover': { opacity: '0.5' } }), {
        els: {}
      }),
      { '&:hover': { opacity: '0.5' } }
    );
  });
});
