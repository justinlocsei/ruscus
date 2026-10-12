import { assert, describe, it } from 'vitest';

import type { ProvidersToSpecs, SpecFromProvider } from './elements.ts';
import { createElement, Element, resolveElements } from './elements.ts';
import { T } from './tests.ts';
import type { ElementSpec, EmptyElementSpecs } from './types.ts';

const e = createElement;

describe('createElement', () => {
  it('creates an element with empty styles by default', () => {
    assert.deepEqual(createElement().current.styles, {});
  });

  it('applies initial styles', () => {
    assert.deepEqual(
      createElement({ color: 'red' }).current.styles,
      { color: 'red' }
    );
  });
});

describe('resolveElements', () => {
  it('resolves eager and lazy providers', () => {
    const root = createElement({ display: 'block' });

    const resolved = resolveElements({
      root,
      title: () => createElement({ color: 'red' })
    });

    assert.strictEqual(resolved.root, root);
    assert.deepEqual(resolved.title?.current.styles, { color: 'red' });
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
      const { current: { children } } = createElement().children({
        body: e({ margin: '0' }),
        title: e().css({ color: 'red' })
      });

      assert.deepEqual(children.body?.current.styles, { margin: '0' });
      assert.deepEqual(children.title?.current.styles, { color: 'red' });
    });

    it('supports lazy child providers', () => {
      const result = createElement().children({
        title: () => e().css({ fontWeight: '700' })
      });

      assert.deepEqual(result.current.children.title?.current.styles, {
        fontWeight: '700'
      });
    });

    it('supports lazy child maps', () => {
      const result = createElement().children(() => ({
        title: e().css({ fontWeight: '700' })
      }));

      assert.deepEqual(result.current.children.title?.current.styles, {
        fontWeight: '700'
      });
    });

    it('allows nested children', () => {
      const parent = createElement().children({
        content: e().children({
          text: e({ color: 'red' })
        })
      });

      assert.deepEqual(
        parent.current.children.content?.current.children.text?.current.styles,
        { color: 'red' }
      );
    });

    it('allows chaining', () => {
      assert.deepEqual(
        createElement()
          .children({ root: e({ display: 'block' }) })
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when children are defined more than once', () => {
      const element = createElement().children({
        alfa: e({ display: 'block' })
      });

      assert.throws(
        () => element.children({ bravo: e({ color: 'red' }) }),
        'children may only be set once'
      );
    });
  });

  describe('css', () => {
    it('adds styles to the element', () => {
      assert.deepEqual(
        new Element().css({ color: 'red' }).current.styles,
        { color: 'red' }
      );
    });

    it('merges styles', () => {
      assert.deepEqual(
        new Element()
          .css({ color: 'red' })
          .css({ background: 'blue' })
          .current
          .styles,
        { color: 'red', background: 'blue' }
      );
    });
  });

  describe('variants', () => {
    it('registers a variant provider', () => {
      const element = createElement().variants(s => ({
        bold: s({ fontWeight: '700' }),
        spacer: s({ marginTop: '1rem' })
      }));

      assert.equal(typeof element.current.variants, 'function');
    });

    it('allows chaining', () => {
      assert.deepEqual(
        createElement()
          .variants(s => ({ bold: s({ fontWeight: '700' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when variants are defined more than once', () => {
      const element = createElement().variants(s => ({
        bold: s({ fontWeight: '700' })
      }));

      assert.throws(
        () => element.variants(s => ({ spacer: s({ marginTop: '1rem' }) })),
        'variants may only be set once'
      );
    });
  });

  describe('nested', () => {
    it('registers nested rules on the element', () => {
      const element = createElement().nested(s => ({
        '&:hover': s({ opacity: '0.5' })
      }));

      assert.equal(typeof element.current.nested[0], 'function');
    });

    it('stores contextual definitions for compile-time resolution', () => {
      const element = createElement()
        .children({ title: e() })
        .nested((s, { els }) => ({ [els.title]: s({ color: 'red' }) }));

      assert.equal(typeof element.current.nested[0], 'function');
    });

    it('types els from children', () => {
      createElement()
        .children({ title: e() })
        .nested((s, { els }) => {
          T.assert<
            T.Equivalent<
              typeof els,
              { title: string }
            >
          >(true);

          return { [els.title]: s({ color: 'red' }) };
        });

      createElement()
        .children({ title: e() })
        .nested((s, { els }) => {
          T.assert<
            T.Equivalent<
              typeof els,
              { title: string }
            >
          >(true);

          return {
            '&:hover': s({ opacity: '0.9' }),
            [els.title]: s({ color: 'red' })
          };
        });

      createElement()
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

    it('exposes variants to nested rules', () => {
      createElement()
        .variants(s => ({
          bold: s({ fontWeight: '700' }),
          spacer: s({ marginTop: '1rem' })
        }))
        .nested((s, { variant }) => {
          T.assert<
            T.Equivalent<
              typeof variant,
              <T extends 'bold' | 'spacer'>(...names: T[]) => string
            >
          >(true);

          return {
            [variant('bold')]: s({ color: 'blue' }),
            [variant('bold', 'spacer')]: s({ color: 'red' })
          };
        });
    });

    it('allows chaining', () => {
      assert.deepEqual(
        createElement()
          .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('allows multiple nested providers', () => {
      const element = createElement()
        .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
        .nested(s => ({ '&:focus': s({ outline: 'none' }) }));

      assert.equal(element.current.nested.length, 2);
    });
  });
});

describe('ProvidersToSpecs', () => {
  it('converts providers to specs', () => {
    T.assert<
      T.Equivalent<
        ProvidersToSpecs<{
          body: ReturnType<typeof createElement>;
          title: () => Element;
        }>,
        {
          body: ElementSpec;
          title: ElementSpec;
        }
      >
    >(true);
  });
});

describe('SpecFromProvider', () => {
  it('infers a nested spec from an element with children', () => {
    type Nested = Element<
      ElementSpec<{ text: ElementSpec }>
    >;

    T.assert<
      T.Equivalent<
        SpecFromProvider<Nested>,
        ElementSpec<{ text: ElementSpec }>
      >
    >(true);
  });

  it('infers variant names from an element with variants', () => {
    type WithVariants = Element<
      ElementSpec<EmptyElementSpecs, 'spacer'>
    >;

    T.assert<
      T.Equivalent<
        SpecFromProvider<WithVariants>,
        ElementSpec<EmptyElementSpecs, 'spacer'>
      >
    >(true);
  });

  it('infers a spec from an eager provider', () => {
    T.assert<
      T.Equivalent<
        SpecFromProvider<ReturnType<typeof createElement>>,
        ElementSpec
      >
    >(true);
  });

  it('infers a spec from a lazy provider', () => {
    T.assert<
      T.Equivalent<
        SpecFromProvider<() => Element>,
        ElementSpec
      >
    >(true);
  });
});
