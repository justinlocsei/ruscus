import { assert, describe, it } from 'vitest';

import {
  extractSourceModuleID,
  getResolvedVirtualCSSModuleID,
  getVirtualCSSModuleForSourceModule,
  injectCSSImport,
  mightContainStyles,
  RESOLVED
} from './transform.ts';

describe('getSourceModuleFromVirtualCSSModule', () => {
  it('decodes a resolved virtual CSS module id', () => {
    const source = '/project/src/card.ts?direct';

    const resolved =
      getResolvedVirtualCSSModuleID(getVirtualCSSModuleForSourceModule(source))
        ?? '';

    assert.equal(extractSourceModuleID(resolved), source);
  });

  it('returns undefined for non-virtual CSS module ids', () => {
    assert.isUndefined(
      extractSourceModuleID('/project/src/card.ts')
    );
  });
});

describe('getVirtualCSSModuleForSourceModule', () => {
  it('builds a virtual CSS module ID from a source module ID', () => {
    const source = '/project/src/card.ts?direct';

    assert.equal(
      getVirtualCSSModuleForSourceModule(source),
      'virtual:ruscus/css/%2Fproject%2Fsrc%2Fcard.ts%3Fdirect.css'
    );
  });

  it('round-trips through getSourceModuleFromVirtualCSSModule', () => {
    const source = '/project/src/card.ts?direct';

    assert.equal(
      extractSourceModuleID(
        getVirtualCSSModuleForSourceModule(source)
      ),
      source
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

describe('getResolvedVirtualCSSModuleID', () => {
  it('returns null for other ids', () => {
    assert.isNull(getResolvedVirtualCSSModuleID('/styles/delta.ts'));

    assert.isNull(
      getResolvedVirtualCSSModuleID(
        `${RESOLVED}${getVirtualCSSModuleForSourceModule('/styles/echo.ts')}`
      )
    );
  });

  it('wraps valid virtual CSS module ids', () => {
    const source = '/styles/charlie.ts';
    const publicID = getVirtualCSSModuleForSourceModule(source);

    assert.equal(
      getResolvedVirtualCSSModuleID(publicID),
      `${RESOLVED}${publicID}`
    );
  });
});
