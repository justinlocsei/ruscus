import { assert, describe, it } from 'vitest';

import {
  buildNestedContext,
  isStyles,
  resolveNestedProvider
} from './blocks.ts';
import { createElement } from './elements.ts';
import type { ElementSpec, ElementSpecs, NestedProvider } from './types.ts';

const e = createElement;

describe('buildNestedContext', () => {
  it('includes selectors for child elements', () => {
    const body = createElement().children({ title: e() });

    assert.deepEqual(
      buildNestedContext(['card', 'body'], body.current.children),
      { els: { title: '.card__body__title' } }
    );
  });

  it('exposes deeply nested selectors', () => {
    const card = createElement().children({
      header: () =>
        e().children(() => ({
          title: e().children(() => ({ text: e() }))
        }))
    });

    assert.deepEqual(
      buildNestedContext(['card'], card.current.children),
      {
        els: {
          header: {
            root: '.card__header',
            title: {
              root: '.card__header__title',
              text: '.card__header__title__text'
            }
          }
        }
      }
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

  it('resolves lazy definitions', () => {
    assert.deepEqual(
      resolveNestedProvider(() => ({ '&:hover': { opacity: '0.5' } }), {
        els: {}
      }),
      { '&:hover': { opacity: '0.5' } }
    );
  });

  it('resolves contextual definitions', () => {
    const body = createElement().children({ title: e() });
    const ctx = buildNestedContext(['card', 'body'], body.current.children);

    const provider: NestedProvider<{ title: ElementSpec }> = ({ els }) => ({
      [els.title]: { color: 'red' }
    });

    assert.deepEqual(
      resolveNestedProvider(provider as NestedProvider<ElementSpecs>, ctx),
      { '.card__body__title': { color: 'red' } }
    );
  });
});
