import { assert, describe, it } from 'vitest';

import {
  camelToKebab,
  kebabToCamel,
  mergeStyles,
  PropertyProjector
} from './styles.ts';
import { checkConversion } from './tests.ts';
import type { Styles } from './types/css.ts';

describe('camelToKebab', () => {
  it('projects camel-cased values as CSS identifiers', () => {
    checkConversion<string, string>(
      (id, property, message) => {
        assert.equal(property, camelToKebab(id), message);
      },
      [
        ['color', 'color'],
        ['backgroundColor', 'background-color'],
        ['WebkitLineClamp', '-webkit-line-clamp']
      ]
    );
  });
});

describe('kebabToCamel', () => {
  it('projects kebab-cased values as camel-cased identifiers', () => {
    assert.equal(kebabToCamel('background-color'), 'backgroundColor');
    assert.equal(kebabToCamel('-webkit-line-clamp'), 'WebkitLineClamp');
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

describe('PropertyProjector', () => {
  it('projects camel-cased values as CSS properties', () => {
    const projector = new PropertyProjector();

    assert.equal(projector.project('backgroundColor'), 'background-color');
    assert.equal(projector.project('backgroundColor'), 'background-color');
    assert.equal(projector.project('WebkitLineClamp'), '-webkit-line-clamp');
  });
});
