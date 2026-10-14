import { assert, describe, it } from 'vitest';

import { defineElement, Element, resolveElements } from './elements.ts';
import { T } from './tests.ts';

const e = defineElement;

describe('defineElement', () => {
  it('defines an element with empty styles by default', () => {
    assert.deepEqual(defineElement().current.styles, {});
  });

  it('applies initial styles', () => {
    assert.deepEqual(
      defineElement({ color: 'red' }).current.styles,
      { color: 'red' }
    );
  });
});

describe('Element', () => {
  it('starts with an empty state', () => {
    assert.deepEqual(new Element().current, {
      children: {},
      nested: [],
      styles: {}
    });
  });

  describe('children', () => {
    it('registers child element instances for each name', () => {
      const { current: { children } } = e().children({
        body: e({ margin: '0' }),
        title: e().css({ color: 'red' })
      });

      assert.deepEqual(children.body?.current.styles, { margin: '0' });
      assert.deepEqual(children.title?.current.styles, { color: 'red' });
    });

    it('supports lazy child providers', () => {
      const result = e().children({
        title: () => e().css({ fontWeight: '700' })
      });

      assert.deepEqual(result.current.children.title?.current.styles, {
        fontWeight: '700'
      });
    });

    it('supports lazy child definitions', () => {
      const result = e().children(() => ({
        title: e().css({ fontWeight: '700' })
      }));

      assert.deepEqual(result.current.children.title?.current.styles, {
        fontWeight: '700'
      });
    });

    it('supports nested children', () => {
      const parent = e().children({
        content: e().children({
          text: e({ color: 'red' })
        })
      });

      assert.deepEqual(
        parent.current.children.content?.current.children.text?.current.styles,
        { color: 'red' }
      );
    });

    it('preserves chaining', () => {
      assert.deepEqual(
        e()
          .children({ root: e({ display: 'block' }) })
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when children are defined more than once', () => {
      const element = e().children({
        alfa: e({ display: 'block' })
      });

      assert.throws(
        () => element.children({ bravo: e({ color: 'red' }) }),
        'children may only be called once'
      );
    });
  });

  describe('css', () => {
    it('adds styles to the element', () => {
      assert.deepEqual(
        e().css({ color: 'red' }).current.styles,
        { color: 'red' }
      );
    });

    it('merges styles', () => {
      assert.deepEqual(
        e()
          .css({ color: 'red' })
          .css({ background: 'blue' })
          .current
          .styles,
        { color: 'red', background: 'blue' }
      );
    });
  });

  describe('nested', () => {
    it('registers nested rules on the element', () => {
      const element = e().nested(s => ({
        '&:hover': s({ opacity: '0.5' })
      }));

      assert.deepEqual(element.current.nested.map(p => typeof p), ['function']);
    });

    it('stores contextual definitions for compile-time resolution', () => {
      const element = e()
        .children({ title: e() })
        .nested((s, { els }) => ({ [els.title]: s({ color: 'red' }) }));

      assert.deepEqual(element.current.nested.map(p => typeof p), ['function']);
    });

    it('exposes narrowly typed elements to the nested provider', () => {
      e()
        .children({ title: e() })
        .nested((s, { els }) => {
          T.assert<
            T.Equivalent<
              typeof els,
              { root: string; title: string }
            >
          >(true);

          return {
            '&:hover': s({ opacity: '0.9' }),
            [els.title]: s({ color: 'red' })
          };
        });
    });

    it('exposes deeply nested elements', () => {
      e()
        .children({
          header: () =>
            e().children(() => ({
              title: e().children(() => ({ text: e() }))
            }))
        })
        .nested((s, { els }) => {
          T.assert<
            T.Equivalent<
              typeof els,
              {
                root: string;
                header: {
                  root: string;
                  title: { root: string; text: string };
                };
              }
            >
          >(true);

          return { [els.header.title.text]: s({ color: 'red' }) };
        });
    });

    it('exposes variants to nested providers', () => {
      e()
        .variants(s => ({
          bold: s({ fontWeight: '700' }),
          spacer: s({ marginTop: '1rem' })
        }))
        .nested((s, { variants }) => {
          T.assert<
            T.Equivalent<
              typeof variants,
              <T extends 'bold' | 'spacer'>(...names: T[]) => string
            >
          >(true);

          // @ts-expect-error unknown variant
          variants('bolder');

          return {
            [variants('bold')]: s({ color: 'blue' }),
            [variants('bold', 'spacer')]: s({ color: 'red' })
          };
        });
    });

    it('preserves chaining', () => {
      assert.deepEqual(
        defineElement()
          .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('supports multiple nested providers', () => {
      const element = defineElement()
        .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
        .nested(s => ({ '&:focus': s({ outline: 'none' }) }));

      assert.equal(element.current.nested.length, 2);
    });
  });

  describe('variants', () => {
    it('registers a variant provider', () => {
      const element = defineElement().variants(s => ({
        bold: s({ fontWeight: '700' }),
        spacer: s({ marginTop: '1rem' })
      }));

      assert.equal(typeof element.current.variants, 'function');
    });

    it('preserves chaining', () => {
      assert.deepEqual(
        defineElement()
          .variants(s => ({ bold: s({ fontWeight: '700' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when variants are defined more than once', () => {
      const element = defineElement().variants(s => ({
        bold: s({ fontWeight: '700' })
      }));

      assert.throws(
        () => element.variants(s => ({ spacer: s({ marginTop: '1rem' }) })),
        'variants may only be called once'
      );
    });
  });
});

describe('resolveElements', () => {
  it('resolves eager and lazy providers', () => {
    const root = defineElement({ display: 'block' });

    const resolved = resolveElements({
      root,
      title: () => defineElement({ color: 'red' })
    });

    assert.strictEqual(resolved.root, root);
    assert.deepEqual(resolved.title?.current.styles, { color: 'red' });
  });
});
