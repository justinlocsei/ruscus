import { describe, it } from 'vitest';

import * as T from '../tests/types.ts';
import type { ToKebabCase } from './utils.ts';

describe('ToKebabCase', () => {
  it('preserves a lowercase string', () => {
    T.assert<T.Equivalent<ToKebabCase<'value'>, 'value'>>(true);
  });

  it('converts a camel-case string to kebab case', () => {
    T.assert<
      T.Equivalent<ToKebabCase<'alfaBravoCharlie'>, 'alfa-bravo-charlie'>
    >(true);
  });

  it('converts a Pascal-case string to kebab case', () => {
    T.assert<
      T.Equivalent<ToKebabCase<'AlfaBravo'>, '-alfa-bravo'>
    >(true);
  });
});
