import { assert, describe, it } from 'vitest';

import { isStyleModuleID, stripQuery } from './shared.ts';

describe('isStyleModuleID', () => {
  it('matches configured style module extensions', () => {
    assert.isTrue(
      isStyleModuleID('/project/card.styles.ts', '.styles.ts')
    );
  });

  it('returns false for other module paths', () => {
    assert.isFalse(isStyleModuleID('/project/card.ts', '.styles.ts'));
    assert.isFalse(
      isStyleModuleID('/project/tokens.ts', '.styles.ts')
    );
  });

  it('ignores import queries', () => {
    assert.isTrue(
      isStyleModuleID('/project/card.styles.ts?direct', '.styles.ts')
    );
  });
});

describe('stripQuery', () => {
  it('returns the path before an import query', () => {
    assert.equal(
      stripQuery('/project/card.styles.ts?direct'),
      '/project/card.styles.ts'
    );
  });

  it('returns the original path when no query is present', () => {
    assert.equal(
      stripQuery('/project/card.styles.ts'),
      '/project/card.styles.ts'
    );
  });
});
