import { assert, describe, it } from 'vitest';

import {
  buildGlobalContext,
  buildNestedContext,
  isDeclarations,
  resolveNestedProvider,
  resolveVariantProvider
} from './blocks.ts';
import { createElement } from './elements.ts';
import type {
  ElementSpec,
  NestedContext,
  NestedProvider,
  VariantSelector
} from './types.ts';

const e = createElement;

describe('buildNestedContext', () => {
  it('includes selectors for child elements', () => {
    const body = createElement().children({ title: e() });

    assert.deepEqual(
      buildNestedContext(['card', 'body'], body.current.children).els,
      {
        root: '.card__body',
        title: '.card__body__title'
      }
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
        root: '.card',
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

  it('builds anchor-relative variant selectors', () => {
    const { variant } = buildNestedContext([], {});

    assert.equal(variant(), '&');

    assert.equal(
      (variant as VariantSelector<string>)('compact'),
      '&.is-compact'
    );

    assert.equal(
      (variant as VariantSelector<string>)('mobile', 'active'),
      '&.is-mobile.is-active'
    );
  });
});

describe('buildGlobalContext', () => {
  it('builds the same element selectors as nested context', () => {
    const card = createElement().children({
      header: () =>
        e().children(() => ({
          title: e()
        }))
    });

    assert.deepEqual(
      buildGlobalContext('card', card.current.children).els,
      buildNestedContext(['card'], card.current.children).els
    );
  });

  it('builds full variant selectors', () => {
    const { variant } = buildGlobalContext('card', {});

    assert.equal(variant(), '.card');

    assert.equal(
      (variant as VariantSelector<string>)('compact'),
      '.card.is-compact'
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

describe('resolveVariantProvider', () => {
  it('resolves contextual definitions', () => {
    assert.deepEqual(
      resolveVariantProvider(
        s => ({ compact: s({ padding: '0.5rem' }) }),
        buildNestedContext([], {})
      ).compact?.current.styles,
      { padding: '0.5rem' }
    );
  });
});

describe('resolveNestedProvider', () => {
  it('resolves contextual definitions', () => {
    const body = createElement().children({ title: e() });
    const ctx = buildNestedContext(['card', 'body'], body.current.children);

    const provider: NestedProvider<
      NestedContext<{ title: ElementSpec }>
    > = (s, { els }) => ({
      [els.title]: s({ color: 'red' })
    });

    assert.deepEqual(
      resolveNestedProvider(
        provider as NestedProvider<typeof ctx>,
        ctx
      )['.card__body__title']?.current.styles,
      { color: 'red' }
    );
  });
});
