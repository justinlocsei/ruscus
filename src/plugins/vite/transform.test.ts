import { assert, describe, it } from 'vitest';

import {
  CONFIG_MODULE_ID,
  createConfigureModuleCode,
  extractSourceModuleID,
  getCSSModuleID,
  getInternalConfigModuleID,
  getInternalCSSModuleID,
  injectStyleImports,
  isResolvedModuleID,
  isVirtualConfigModuleID,
  RESOLVED
} from './transform.ts';

describe('createConfigureModuleCode', () => {
  it('emits a configure import and call', () => {
    const code = createConfigureModuleCode({ naming: 'compact' });

    assert.equal(
      code,
      `import { configure } from 'ruscus';\nconfigure({"naming":"compact"});\n`
    );
  });
});

describe('extractSourceModuleID', () => {
  it('decodes a resolved virtual CSS module ID', () => {
    const source = '/project/src/card.ts?direct';

    const resolved = getInternalCSSModuleID(getCSSModuleID(source))
      ?? '';

    assert.equal(extractSourceModuleID(resolved), source);
  });

  it('returns undefined for non-virtual CSS module IDs', () => {
    assert.isUndefined(
      extractSourceModuleID('/project/src/card.ts')
    );
  });
});

describe('getInternalConfigModuleID', () => {
  it('returns the resolved configure module ID', () => {
    assert.equal(
      getInternalConfigModuleID(),
      `${RESOLVED}${CONFIG_MODULE_ID}`
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
  it('returns null for other IDs', () => {
    assert.isNull(getInternalCSSModuleID('/styles/delta.ts'));

    assert.isNull(
      getInternalCSSModuleID(
        `${RESOLVED}${getCSSModuleID('/styles/echo.ts')}`
      )
    );
  });

  it('wraps valid virtual CSS module IDs', () => {
    const source = '/styles/charlie.ts';
    const publicID = getCSSModuleID(source);

    assert.equal(
      getInternalCSSModuleID(publicID),
      `${RESOLVED}${publicID}`
    );
  });
});

describe('injectStyleImports', () => {
  it('injects configure and css by default', () => {
    const code = 'export default component("card").apply();';
    const transformed = injectStyleImports(code, '/project/card.ts');

    assert.match(transformed, /^import "virtual:ruscus\/config";\n/);
    assert.match(transformed, /^import "virtual:ruscus\/css\//m);
  });

  it('omits css when disabled', () => {
    const code = 'export default component("card").apply();';
    const transformed = injectStyleImports(code, '/project/card.ts', {
      css: false
    });

    assert.match(transformed, /^import "virtual:ruscus\/config";\n/);
    assert.notMatch(transformed, /virtual:ruscus\/css\//);
  });
});

describe('isResolvedModuleID', () => {
  it('returns false for non-internal module IDs', () => {
    assert.isFalse(isResolvedModuleID('/project/src/card.ts'));
    assert.isFalse(isResolvedModuleID(getCSSModuleID('/styles/delta.ts')));
  });

  it('returns true for resolved virtual CSS module IDs', () => {
    const source = '/styles/charlie.ts';

    assert.isTrue(
      isResolvedModuleID(getCSSModuleID(source, { resolved: true }))
    );

    assert.isTrue(
      isResolvedModuleID(getInternalCSSModuleID(getCSSModuleID(source)) ?? '')
    );
  });
});

describe('isVirtualConfigModuleID', () => {
  it('recognizes public and resolved configure module IDs', () => {
    assert.isTrue(isVirtualConfigModuleID(CONFIG_MODULE_ID));
    assert.isTrue(isVirtualConfigModuleID(getInternalConfigModuleID()));
  });

  it('returns false for other IDs', () => {
    assert.isFalse(isVirtualConfigModuleID('/project/card.ts'));
    assert.isFalse(
      isVirtualConfigModuleID(getCSSModuleID('/styles/delta.ts'))
    );
  });
});
