import { assert, describe, it } from 'vitest';

import {
  cssToLoader,
  cssToSource,
  injectCSSImport,
  mayContainStyles,
  sourceToCSS,
  VIRTUAL
} from './transform.ts';

describe('cssToLoader', () => {
  it('wraps valid CSS module IDs', () => {
    const source = '/styles/charlie.ts';
    const publicID = sourceToCSS(source);

    assert.equal(
      cssToLoader(publicID),
      `${VIRTUAL}${publicID}`
    );
  });

  it('returns undefined for other IDs', () => {
    assert.isUndefined(cssToLoader('/styles/delta.ts'));

    assert.isUndefined(
      cssToLoader(`${VIRTUAL}${sourceToCSS('/styles/echo.ts')}`)
    );
  });
});

describe('cssToSource', () => {
  it('decodes a loader-prefixed CSS module id', () => {
    const source = '/project/src/card.ts?direct';
    const loader = cssToLoader(sourceToCSS(source)) ?? '';

    assert.equal(cssToSource(loader), source);
  });

  it('returns undefined for non-wrapped IDs', () => {
    assert.isUndefined(cssToSource('/project/src/card.ts'));
  });
});

describe('injectCSSImport', () => {
  it('injects a virtual CSS import', () => {
    const code = 'export default component("card").apply();';
    const transformed = injectCSSImport(code, '/project/card.ts');

    assert.match(transformed, /^import "virtual:ruscus\/css\//);
    assert.isTrue(transformed.endsWith(code));
  });

  it('does not inject the same import twice', () => {
    const code = 'export default component("card").apply();';
    const transformed = injectCSSImport(code, '/project/card.ts');

    assert.equal(injectCSSImport(transformed, '/project/card.ts'), transformed);
  });
});

describe('mayContainStyles', () => {
  it('returns true when the source calls apply', () => {
    assert.isTrue(
      mayContainStyles('export default component("alfa").css({}).apply();')
    );
  });

  it('returns false when the source does not call apply', () => {
    assert.isFalse(
      mayContainStyles('export default { value: "charlie" };')
    );
  });
});

describe('sourceToCSS', () => {
  it('builds a virtual CSS module ID from a source module ID', () => {
    const source = '/project/src/card.ts?direct';

    assert.equal(
      sourceToCSS(source),
      'virtual:ruscus/css/%2Fproject%2Fsrc%2Fcard.ts%3Fdirect.css'
    );
  });

  it('round-trips through cssToSource', () => {
    const source = '/project/src/card.ts?direct';

    assert.equal(cssToSource(sourceToCSS(source)), source);
  });
});
