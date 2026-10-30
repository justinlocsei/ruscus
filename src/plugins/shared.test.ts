import { assert, describe, it } from 'vitest';

import { stripQuery } from './shared.ts';

describe('stripQuery', () => {
  it('returns the original path when no query is present', () => {
    assert.equal(
      stripQuery('/project/card.styles.ts'),
      '/project/card.styles.ts'
    );
  });

  it('returns the path before an import query', () => {
    assert.equal(
      stripQuery('/project/card.styles.ts?direct'),
      '/project/card.styles.ts'
    );
  });
});
