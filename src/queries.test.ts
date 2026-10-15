import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';
import { styleComponent } from './css.ts';
import { defineAbsoluteFragment } from './fragments.ts';
import { defineQueries } from './queries.ts';
import { css, T } from './tests.ts';

describe('defineQueries', () => {
  it('maps labeled blocks to query fragments', () => {
    const queries = defineQueries({
      alfa: '@media (min-width: 768px)',
      bravo: '@container card (min-width: 400px)'
    });

    const rules = queries({
      alfa: {
        '.card': defineAbsoluteFragment({ color: 'red' })
      },
      bravo: {
        '.card__title': defineAbsoluteFragment({ fontSize: '1rem' })
      }
    });

    assert.deepEqual(
      rules['@media (min-width: 768px)']?.styles.nested['.card']?.styles.root,
      { color: 'red' }
    );
    assert.deepEqual(
      rules['@container card (min-width: 400px)']?.styles.nested[
        '.card__title'
      ]?.styles.root,
      { fontSize: '1rem' }
    );
  });

  it('accepts partial labeled blocks', () => {
    const queries = defineQueries({
      alfa: '@media (min-width: 768px)',
      bravo: '@media (min-width: 1024px)'
    });

    const rules = queries({
      alfa: {
        '.card': defineAbsoluteFragment({ display: 'block' })
      }
    });

    assert.deepEqual(
      rules['@media (min-width: 768px)']?.styles.nested['.card']?.styles.root,
      { display: 'block' }
    );
    assert.equal(rules['@media (min-width: 1024px)'], undefined);
  });

  it('exposes raw queries on the provider', () => {
    const queries = defineQueries({
      alfa: '@media (min-width: 768px)',
      bravo: '@container card (min-width: 400px)'
    });

    assert.equal(queries.alfa, '@media (min-width: 768px)');
    assert.equal(queries.bravo, '@container card (min-width: 400px)');
  });

  it('types labeled blocks and accessors', () => {
    const queries = defineQueries({
      alfa: '@media (min-width: 768px)',
      bravo: '@container card (min-width: 400px)'
    });

    T.assert<T.Equivalent<keyof typeof queries, 'alfa' | 'bravo'>>(true);
    T.assert<T.Equivalent<typeof queries.alfa, string>>(true);

    // @ts-expect-error unknown query label
    queries({ charlie: { '.card': defineAbsoluteFragment() } });

    // @ts-expect-error unknown query accessor
    queries.charlie;
  });

  it('spreads into global styles', () => {
    const queries = defineQueries({
      mobile: '@media (min-width: 768px)'
    });

    const output = styleComponent(
      new Component('card')
        .global(s => ({
          ...queries({
            mobile: {
              '.card': s({ color: 'black' })
            }
          })
        }))
        .current
    );

    assert.equal(
      output,
      css`
        @media (min-width: 768px) {
          .card {
            color: black;
          }
        }
      `
    );
  });
});
