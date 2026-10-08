import { assert, describe, it } from 'vitest';

import { asProperty, buildSelector } from './identifiers.ts';
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
