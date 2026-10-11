import { assert, describe, it } from 'vitest';

import { defineQueries } from './queries.ts';
import { T } from './tests.ts';

describe('defineQueries', () => {
  it('maps labeled blocks to queries', () => {
    const queries = defineQueries({
      alfa: '@media (min-width: 768px)',
      bravo: '@container card (min-width: 400px)'
    });

    assert.deepEqual(
      queries({
        alfa: { '.card': { color: 'red' } },
        bravo: { '.card__title': { fontSize: '1rem' } }
      }),
      {
        '@media (min-width: 768px)': {
          '.card': { color: 'red' }
        },
        '@container card (min-width: 400px)': {
          '.card__title': { fontSize: '1rem' }
        }
      }
    );
  });

  it('accepts partial labeled blocks', () => {
    const queries = defineQueries({
      alfa: '@media (min-width: 768px)',
      bravo: '@media (min-width: 1024px)'
    });

    assert.deepEqual(
      queries({ alfa: { '.card': { display: 'block' } } }),
      {
        '@media (min-width: 768px)': {
          '.card': { display: 'block' }
        }
      }
    );
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
    queries({ charlie: { '.card': { color: 'red' } } });

    // @ts-expect-error unknown query accessor
    queries.charlie;
  });
});
