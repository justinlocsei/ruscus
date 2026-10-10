import { assert, describe, it } from 'vitest';

import {
  buildNestedContext,
  isDeclarations,
  resolveNestedProvider
} from './blocks.ts';
import { createElement } from './elements.ts';
import type { ElementSpec, NestedContext, NestedProvider } from './types.ts';

const e = createElement;

describe('buildNestedContext', () => {
  it('includes selectors for child elements', () => {
    const body = createElement().children({ title: e() });

    assert.deepEqual(
      buildNestedContext(['card', 'body'], body.current.children).els,
      { title: '.card__body__title' }
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
      buildNestedContext(['card'], card.current.children).els,
      {
        header: {
          root: '.card__header',
          title: {
            root: '.card__header__title',
            text: '.card__header__title__text'
          }
        }
      }
    );
  });
});

describe('isDeclarations', () => {
  it('accepts declaration blocks', () => {
    assert.equal(isDeclarations({ color: 'red', opacity: 1 }), true);
  });

  it('accepts undefined declaration values', () => {
    assert.equal(isDeclarations({ color: 'red', margin: undefined }), true);
  });

  it('rejects nested selector blocks', () => {
    assert.equal(isDeclarations({ title: { color: 'red' } }), false);
  });
});

describe('resolveNestedProvider', () => {
  it('returns eager definitions', () => {
    const block = { '&:hover': { opacity: '0.5' } };

    assert.strictEqual(
      resolveNestedProvider(block, buildNestedContext([], {})),
      block
    );
  });

  it('resolves lazy definitions', () => {
    assert.deepEqual(
      resolveNestedProvider(
        () => ({ '&:hover': { opacity: '0.5' } }),
        buildNestedContext([], {})
      ),
      { '&:hover': { opacity: '0.5' } }
    );
  });

  it('resolves contextual definitions', () => {
    const body = createElement().children({ title: e() });
    const ctx = buildNestedContext(['card', 'body'], body.current.children);

    const provider: NestedProvider<
      NestedContext<{ title: ElementSpec }>
    > = ({ els }) => ({
      [els.title]: { color: 'red' }
    });

    assert.deepEqual(
      resolveNestedProvider(provider as NestedProvider, ctx),
      {
        '.card__body__title': { color: 'red' }
      }
    );
  });
});
