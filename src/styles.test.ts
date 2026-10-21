import { assert, describe, it } from 'vitest';

import { asIdentifier, mergeStyles } from './styles.ts';
import { checkConversion } from './tests.ts';
import type { Styles } from './types/css.ts';

describe('asIdentifier', () => {
  it('projects camel-cased values as CSS identifiers', () => {
    checkConversion<string, string>(
      (id, property, message) => {
        assert.equal(property, asIdentifier(id), message);
      },
      [
        ['color', 'color'],
        ['backgroundColor', 'background-color'],
        ['WebkitLineClamp', '-webkit-line-clamp']
      ]
    );
  });
});

describe('mergeStyles', () => {
  it('merges styles on top of a base', () => {
    assert.deepEqual(
      mergeStyles({ color: 'red' }, { background: 'blue' }),
      { background: 'blue', color: 'red' }
    );
  });

  it('does not mutate the base styles', () => {
    const base: Styles = { color: 'red' };

    assert.deepEqual(mergeStyles(base, { color: 'blue' }), { color: 'blue' });
    assert.deepEqual(base, { color: 'red' });
  });

  it('gracefully handles empty styles', () => {
    assert.deepEqual(
      mergeStyles({}, { color: 'red' }, {}, { background: 'blue' }),
      { background: 'blue', color: 'red' }
    );
  });
});
