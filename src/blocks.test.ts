import { assert, describe, it } from 'vitest';

import {
  buildNestedContext,
  isDeclarations,
  resolveNestedProvider,
  resolveVariantProvider
} from './blocks.ts';
import { defineElement } from './elements.ts';
import type {
  ElementSpec,
  NestedContext,
  NestedProvider,
  VariantSelector
} from './types.ts';

const e = defineElement;

describe('buildNestedContext', () => {
  it('includes selectors for child elements', () => {
    const body = defineElement().children({ title: e() });

    assert.deepEqual(
      buildNestedContext(['card', 'body'], body.current.children).els,
      {
        root: '.card__body',
        title: '.card__body__title'
      } as Record<string, string>
    );
  });

  it('exposes deeply nested selectors', () => {
    const card = defineElement().children({
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
      } as Record<string, unknown>
    );
  });

  it('builds anchor-relative variant selectors', () => {
    const { variants } = buildNestedContext([], {});

    assert.equal(variants(), '&');

    assert.equal(
      (variants as VariantSelector<string>)('compact'),
      '&.is-compact'
    );

    assert.equal(
      (variants as VariantSelector<string>)('mobile', 'active'),
      '&.is-mobile.is-active'
    );
  });

    const card = defineElement().children({
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
    const { variants } = buildGlobalContext('card', {});

    assert.equal(variants(), '.card');

    assert.equal(
      (variants as VariantSelector<string>)('compact'),
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
    const body = defineElement().children({ title: e() });
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
