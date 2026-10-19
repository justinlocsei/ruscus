import { describe, it } from 'vitest';

import { T } from '../tests.ts';
import type { Thunkable } from './utils.ts';

describe('Thunkable', () => {
  it('accepts an eager value or a thunk', () => {
    type Subject = Thunkable<{ alfa: 1 }>;

    T.assert<T.Assignable<{ alfa: 1 }, Subject>>(true);
    T.assert<T.Assignable<() => { alfa: 1 }, Subject>>(true);
  });
});
