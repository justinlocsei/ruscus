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
