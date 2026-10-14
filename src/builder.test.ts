import { assert, describe, it } from 'vitest';

import Builder from './builder.ts';

describe('Builder', () => {
  type Numbers = Record<string, number>;

  class TestBuilder extends Builder<{
    id?: string;
    numbers: Numbers;
  }> {
    constructor() {
      super({ numbers: {} });
    }

    setID(value: string) {
      this.setStateField('id', value);
    }

    setNumbers(value: Numbers) {
      this.setStateField('numbers', value);
    }
  }

  it('exposes its state', () => {
    assert.deepEqual(new TestBuilder().current, { numbers: {} });
  });

  it('updates its state', () => {
    const builder = new TestBuilder();

    assert.isUndefined(builder.current.id);

    builder.setID('test');

    assert.equal(builder.current.id, 'test');
  });

  it('throws if a field is set twice', () => {
    const builder = new TestBuilder();

    builder.setID('alfa');

    assert.throws(() => builder.setID('bravo'), 'id may only be set once');
  });

  it('detects empty objects', () => {
    const builder = new TestBuilder();

    builder.setNumbers({ alfa: 1 });
    assert.deepEqual(builder.current.numbers, { alfa: 1 });

    assert.throws(
      () => builder.setNumbers({ bravo: 2 }),
      'numbers may only be set once'
    );
  });
});
