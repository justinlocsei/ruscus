import { assert, describe, it } from 'vitest';

import {
  camelToKebab,
  defineStyles,
  mergeStyles,
  PropertyProjector,
  splitSelector
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
        ['WebkitLineClamp', '-webkit-line-clamp'],
        ['--Explorer--alfaBravo', '--Explorer--alfaBravo']
      ]
    );
  });
});

describe('defineStyles', () => {
  it('returns the given styles object', () => {
    const input: Styles = {
      color: 'red',
      display: 'flex'
    };

    assert.equal(defineStyles(input), input);
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

    assert.equal(
      projector.project('--Explorer--alfaBravo'),
      '--Explorer--alfaBravo'
    );
  });
});

describe('splitSelector', () => {
  it('returns a single segment when there is no list', () => {
    assert.deepEqual(splitSelector('textarea'), ['textarea']);
  });

  it('splits a comma-separated selector list', () => {
    assert.deepEqual(splitSelector('button, input'), ['button', ' input']);
  });

  it('preserves whitespace in segments', () => {
    assert.deepEqual(splitSelector(' button ,  input '), [
      ' button ',
      '  input '
    ]);
  });
  it('ignores commas inside brackets', () => {
    assert.deepEqual(
      splitSelector('[title="a, b"], textarea'),
      ['[title="a, b"]', ' textarea']
    );
  });

  it('ignores commas inside parentheses', () => {
    assert.deepEqual(
      splitSelector(':is(button, input)'),
      [':is(button, input)']
    );
  });
});
