import { assert, describe, it } from 'vitest';

import { projectProperty } from './properties.ts';
import { checkConversion } from './tests.ts';

describe('projectProperty', () => {
  it('projects camelCase properties as CSS properties', () => {
    checkConversion<string, string>(
      (input, output, message) => {
        assert.equal(output, projectProperty(input), message);
      },
      [
        ['color', 'color'],
        ['backgroundColor', 'background-color'],
        ['WebkitLineClamp', '-webkit-line-clamp']
      ]
    );
  });
});
