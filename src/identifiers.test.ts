import { assert, describe, it } from 'vitest';

import {
  asProperty,
  buildIdentifiersContext,
  buildSelector
} from './identifiers.ts';
import { checkConversion } from './tests.ts';

describe('asProperty', () => {
  it('projects camelCase properties as CSS properties', () => {
    checkConversion<string, string>(
      (id, property, message) => {
        assert.equal(property, asProperty(id), message);
      },
      [
        ['color', 'color'],
        ['backgroundColor', 'background-color'],
        ['WebkitLineClamp', '-webkit-line-clamp']
      ]
    );
  });
});

describe('buildIdentifiersContext', () => {
  it('projects string and variable identifiers', () => {
    const context = buildIdentifiersContext('ui--card', {
      alfa: 'string',
      bravo: 'variable'
    });

    assert.deepEqual(context, {
      ids: {
        alfa: 'ui--card--alfa',
        bravo: '--ui--card--bravo'
      }
    });
  });

  it('projects camelCase names as kebab-case', () => {
    const context = buildIdentifiersContext('card', {
      alfaBeta: 'string'
    });

    assert.equal(context.ids.alfaBeta, 'card--alfa-beta');
  });
});

describe('buildSelector', () => {
  it('joins levels with BEM element separators', () => {
    checkConversion<readonly string[], string>(
      (levels, selector, message) => {
        assert.equal(selector, buildSelector(levels), message);
      },
      [
        [['card'], '.card'],
        [['card', 'body'], '.card__body'],
        [['card', 'body', 'title'], '.card__body__title']
      ]
    );
  });
});
