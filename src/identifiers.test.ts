import { assert, describe, it } from 'vitest';

import { asProperty, buildIdentifiersContext } from './identifiers.ts';
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
