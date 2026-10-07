import { assert, describe, it } from 'vitest';

import { Element } from './elements.ts';

describe('Element', () => {
  it('has empty styles by default', () => {
    assert.deepEqual(new Element().styles, {});
  });

  describe('css', () => {
    it('adds styles to the element', () => {
      assert.deepEqual(
        new Element().css({ color: 'red' }).styles,
        { color: 'red' }
      );
    });

    it('merges styles', () => {
      assert.deepEqual(
        new Element()
          .css({ color: 'red' })
          .css({ background: 'blue' })
          .styles,
        { color: 'red', background: 'blue' }
      );
    });
  });
});
