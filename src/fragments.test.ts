import { assert, describe, it } from 'vitest';

import {
  defineAbsoluteFragment,
  defineRelativeFragment,
  Fragment
} from './fragments.ts';
import type { GlobalDefinitions, NestedDefinitions } from './types.ts';

describe('FragmentDefinitions', () => {
  it('requires relative fragments in nested definitions', () => {
    type AssertNested<T extends NestedDefinitions> = T;

    // @ts-expect-error absolute top-level nested key
    type _InvalidNested = AssertNested<{
      '.card': ReturnType<typeof defineAbsoluteFragment>;
    }>;
  });

  it('requires absolute fragments in global definitions', () => {
    type AssertGlobal<T extends GlobalDefinitions> = T;

    // @ts-expect-error relative top-level global key
    type _InvalidGlobal = AssertGlobal<{
      '&:hover': ReturnType<typeof defineRelativeFragment>;
    }>;
  });
});

describe('defineAbsoluteFragment', () => {
  it('creates an absolute fragment', () => {
    assert.equal(defineAbsoluteFragment().scope, 'absolute');
  });
});

describe('defineRelativeFragment', () => {
  it('creates a relative fragment', () => {
    assert.equal(defineRelativeFragment().scope, 'relative');
  });
});

describe('Fragment', () => {
  it('uses an empty state by default', () => {
    assert.deepEqual(new Fragment('relative').current, {
      nested: {},
      styles: {}
    });
  });

  it('applies CSS declarations', () => {
    assert.deepEqual(
      defineRelativeFragment({ color: 'red' }).current.styles,
      { color: 'red' }
    );
  });

  it('merges CSS declarations', () => {
    assert.deepEqual(
      defineRelativeFragment({ color: 'red' }).css({ opacity: '0.5' }).current
        .styles,
      { color: 'red', opacity: '0.5' }
    );
  });

  it('registers nested fragments', () => {
    const fragment = defineRelativeFragment({ color: 'red' }).nested({
      '&:hover': defineRelativeFragment({ opacity: '0.5' })
    });

    assert.deepEqual(
      fragment.current.nested['&:hover']?.current.styles,
      { opacity: '0.5' }
    );
  });

  it('throws when nested rules are defined more than once', () => {
    const fragment = defineRelativeFragment().nested({
      a: defineRelativeFragment({ color: 'red' })
    });

    assert.throws(
      () => fragment.nested({ b: defineRelativeFragment() }),
      'nested may only be set once'
    );
  });
});
