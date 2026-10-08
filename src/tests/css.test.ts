import { assert, describe, it } from 'vitest';

import { css } from './css.ts';

describe('css', () => {
  it('dedents a block to flush-left CSS', () => {
    assert.equal(
      css`
        .card {
          color: black;
        }
      `,
      [
        '.card {',
        '  color: black;',
        '}'
      ].join('\n')
    );
  });

  it('preserves blank lines between rules', () => {
    assert.equal(
      css`
        .alfa {
          color: red;
        }

        .bravo {
          color: blue;
        }
      `,
      [
        '.alfa {',
        '  color: red;',
        '}',
        '',
        '.bravo {',
        '  color: blue;',
        '}'
      ].join('\n')
    );
  });

  it('interpolates values', () => {
    const selector = '.card__line';

    assert.equal(
      css`
        ${selector} {
          margin-top: 0;
        }
      `,
      [
        '.card__line {',
        '  margin-top: 0;',
        '}'
      ].join('\n')
    );
  });
});
