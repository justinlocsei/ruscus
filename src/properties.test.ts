import { assert, describe, it } from 'vitest';

import { asProperty } from './properties.ts';
import { checkConversion } from './tests.ts';

describe('asProperty', () => {
  it('projects camelCase properties as CSS properties', () => {
    checkConversion<string, string>(
      (input, output, message) => {
        assert.equal(output, asProperty(input), message);
      },
      [
        ['color', 'color'],
        ['backgroundColor', 'background-color'],
        ['WebkitLineClamp', '-webkit-line-clamp']
      ]
    );
  });
});
