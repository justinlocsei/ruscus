import { assert, describe, it } from 'vitest';

import type { ProvidersToSpecs, SpecFromProvider } from './elements.ts';
import { createElement, Element, resolveElements } from './elements.ts';
import { T } from './tests.ts';
import type { ElementSpec } from './types.ts';

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
  it('has empty styles by default', () => {
    assert.deepEqual(new Element().current.styles, {});
  });

  it('has no children by default', () => {
    assert.deepEqual(new Element().current.children, {});
  });

  describe('children', () => {
    it('registers child element instances for each name', () => {
      const { current: { children } } = createElement().children(e => ({
        body: e({ margin: '0' }),
        title: e().css({ color: 'red' })
      }));

      assert.deepEqual(children.body?.current.styles, { margin: '0' });
      assert.deepEqual(children.title?.current.styles, { color: 'red' });
    });

    it('supports lazy child providers', () => {
      const result = createElement().children(e => ({
        title: () => e().css({ fontWeight: '700' })
      }));

      assert.deepEqual(result.current.children.title?.current.styles, {
        fontWeight: '700'
      });
    });

    it('allows nested children', () => {
      const parent = createElement().children(e => ({
        content: e().children(n => ({
          text: n({ color: 'red' })
        }))
      }));

      assert.deepEqual(
        parent.current.children.content?.current.children.text?.current.styles,
        { color: 'red' }
      );
    });

    it('allows chaining after children', () => {
      assert.deepEqual(
        createElement()
          .children(e => ({ root: e({ display: 'block' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
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
