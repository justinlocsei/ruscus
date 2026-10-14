import { assert, describe, it } from 'vitest';

import { asProperty, buildIdentifiersContext } from './identifiers.ts';
import { checkConversion } from './tests.ts';

describe('asProperty', () => {
  it('projects camel-cased values as CSS properties', () => {
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
  it('projects all supported identifier types', () => {
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

  it('normalizes camel-cased identifier names', () => {
    const context = buildIdentifiersContext('card', {
      alfaBeta: 'string'
    });

    assert.equal(context.ids.alfaBeta, 'card--alfa-beta');
  });
});
