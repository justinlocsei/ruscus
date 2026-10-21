import { assert, describe, it } from 'vitest';

import {
  asCamelCase,
  asIdentifier,
  mergeStyles,
  PropertyProjector
} from './styles.ts';
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

describe('asCamelCase', () => {
  it('projects kebab-cased values as camel-cased identifiers', () => {
    assert.equal(asCamelCase('background-color'), 'backgroundColor');
    assert.equal(asCamelCase('-webkit-line-clamp'), 'WebkitLineClamp');
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
