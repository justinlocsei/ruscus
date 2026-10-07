import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';

describe('Component', () => {
  const component = () => new Component('testing');

  it('has empty styles by default', () => {
    assert.deepEqual(component().styles, {});
  });

  it('has an ID', () => {
    assert.equal(new Component('alfa').id, 'alfa');
    assert.equal(new Component('bravo').id, 'bravo');
  });

  it('can apply a namespace to the ID', () => {
    assert.equal(
      new Component('alfa', { namespace: 'bravo' }).id,
      'bravo--alfa'
    );

    assert.equal(
      new Component('alfa', { namespace: 'charlie' }).id,
      'charlie--alfa'
    );
  });

  describe('css', () => {
    it('adds styles to the component', () => {
      assert.deepEqual(
        component().css({ color: 'red' }).styles,
        { color: 'red' }
      );
    });

    it('merges styles', () => {
      assert.deepEqual(
        component()
          .css({ color: 'red' })
          .css({ background: 'blue' })
          .styles,
        { color: 'red', background: 'blue' }
      );
    });
  });
});
