import { assert, describe, it } from 'vitest';

import { T } from './tests.ts';
import { resolve } from './utils.ts';

describe('resolve', () => {
  it('returns eager values', () => {
    assert.deepEqual(resolve('value'), 'value');
  });

  it('invokes thunks', () => {
    assert.deepEqual(resolve(() => ('value')), 'value');
  });

  it('preserves the wrapped type', () => {
    const string = resolve('value' as string);
    const number = resolve(() => 1);

    T.assert<T.Equivalent<typeof string, string>>(true);
    T.assert<T.Equivalent<typeof number, number>>(true);
  });
});
