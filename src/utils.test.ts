import { assert, describe, it } from 'vitest';

import { T } from './tests.ts';
import { cast, resolve } from './utils.ts';

describe('cast', () => {
  it('casts a value', () => {
    const input: string = 'value';

    const asString = cast<string>(input);
    const asNumber = cast<number>(input);

    assert.equal(asString, input);

    T.assert<T.Equivalent<typeof asString, string>>(true);
    T.assert<T.Equivalent<typeof asNumber, number>>(true);
  });
});

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
