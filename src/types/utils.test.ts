import { describe, it } from 'vitest';

import { T } from '../tests.ts';
import type { Patch, Thunkable } from './utils.ts';

describe('Patch', () => {
  it('rejects invalid field types', () => {
    type Base = { count: number; label: string };
    type Current = { count: 1; label: 'a' };

    // @ts-expect-error invalid count patch
    type _Invalid = Patch<Base, Current, { count: boolean }>;
  });

  it('rejects unknown fields', () => {
    type Base = { count: number; label: string };
    type Current = { count: 1; label: 'a' };

    // @ts-expect-error unknown base field
    type _Invalid = Patch<Base, Current, { meta: string }>;
  });

  it('replaces selected fields on a narrow object', () => {
    type Base = { count: number; label: string };
    type Current = { count: 1; label: 'a' };

    T.assert<
      T.Equivalent<
        Patch<Base, Current, { count: 2 }>,
        { count: 2; label: 'a' }
      >
    >(true);
  });

  it('patches against a wide base', () => {
    type Base = { items: Record<string, never> | Record<string, number> };
    type Current = { items: Record<string, never> };

    T.assert<
      T.Equivalent<
        Patch<Base, Current, { items: { x: 1 } }>,
        { items: { x: 1 } }
      >
    >(true);
  });
});

describe('Thunkable', () => {
  it('accepts an eager value or a thunk', () => {
    type Subject = Thunkable<{ alfa: 1 }>;

    T.assert<T.Assignable<{ alfa: 1 }, Subject>>(true);
    T.assert<T.Assignable<() => { alfa: 1 }, Subject>>(true);
  });
});
