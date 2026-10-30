import { assert, describe, it } from 'vitest';

import {
  extractSourceModuleID,
  getCSSModuleID,
  getInternalCSSModuleID,
  injectCSSImport,
  isResolvedModuleID,
  mightContainStyles,
  RESOLVED
} from './transform.ts';

describe('extractSourceModuleID', () => {
  it('decodes a resolved virtual CSS module id', () => {
    const source = '/project/src/card.ts?direct';

    const resolved = getInternalCSSModuleID(getCSSModuleID(source))
      ?? '';

    assert.equal(extractSourceModuleID(resolved), source);
  });

  it('returns undefined for non-virtual CSS module ids', () => {
    assert.isUndefined(
      extractSourceModuleID('/project/src/card.ts')
    );
  });
});

describe('getCSSModuleID', () => {
  it('builds a resolved virtual CSS module ID from a source module ID', () => {
    const source = '/project/src/card.ts?direct';

    assert.equal(
      getCSSModuleID(source, { resolved: true }),
      getInternalCSSModuleID(getCSSModuleID(source))
    );
  });

  it('builds a virtual CSS module ID from a source module ID', () => {
    const source = '/project/src/card.ts?direct';

    assert.equal(
      getCSSModuleID(source),
      'virtual:ruscus/css/%2Fproject%2Fsrc%2Fcard.ts%3Fdirect.css'
    );
  });

  it('round-trips through extractSourceModuleID', () => {
    const source = '/project/src/card.ts?direct';

    assert.equal(
      extractSourceModuleID(
        getCSSModuleID(source)
      ),
      source
    );
  });
});

describe('getInternalCSSModuleID', () => {
  it('returns null for other ids', () => {
    assert.isNull(getInternalCSSModuleID('/styles/delta.ts'));

    assert.isNull(
      getInternalCSSModuleID(
        `${RESOLVED}${getCSSModuleID('/styles/echo.ts')}`
      )
    );
  });

  it('wraps valid virtual CSS module ids', () => {
    const source = '/styles/charlie.ts';
    const publicID = getCSSModuleID(source);

    assert.equal(
      getInternalCSSModuleID(publicID),
      `${RESOLVED}${publicID}`
    );
  });
});

describe('injectCSSImport', () => {
  it('does not inject the same import twice', () => {
    const code = 'export default component("card").apply();';
    const transformed = injectCSSImport(code, '/project/card.ts');

    assert.equal(injectCSSImport(transformed, '/project/card.ts'), transformed);
  });

  it('injects a virtual CSS import', () => {
    const code = 'export default component("card").apply();';
    const transformed = injectCSSImport(code, '/project/card.ts');

    assert.match(transformed, /^import "virtual:ruscus\/css\//);
    assert.isTrue(transformed.endsWith(code));
  });
});

describe('isResolvedModuleID', () => {
  it('returns false for non-internal module ids', () => {
    assert.isFalse(isResolvedModuleID('/project/src/card.ts'));
    assert.isFalse(isResolvedModuleID(getCSSModuleID('/styles/delta.ts')));
  });

  it('returns true for resolved virtual CSS module ids', () => {
    const source = '/styles/charlie.ts';

    assert.isTrue(
      isResolvedModuleID(getCSSModuleID(source, { resolved: true }))
    );

    assert.isTrue(
      isResolvedModuleID(getInternalCSSModuleID(getCSSModuleID(source)) ?? '')
    );
  });
});

describe('mightContainStyles', () => {
  it('returns false when the source does not call apply', () => {
    assert.isFalse(
      mightContainStyles('export default { value: "charlie" };')
    );
  });

  it('returns true when the source calls apply', () => {
    assert.isTrue(
      mightContainStyles('export default component("alfa").css({}).apply();')
    );
  });
});
