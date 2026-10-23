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
  it('wraps a source module in a virtual CSS one', () => {
    const source = '/project/src/card.ts?direct';
    const css = sourceToCSS(source);

    assert.match(css, /^virtual:ruscus\/css\//);
    assert.match(css, /\.css$/);
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
  it('extracts the source module from a CSS wrapper', () => {
    const source = '/project/src/card.ts?direct';
    const virtual = sourceToCSS(source);

    assert.equal(cssToSource(virtual), source);
  });

  it('returns undefined for non-wrapped IDs', () => {
    assert.isUndefined(cssToSource('/project/src/card.ts'));
  });
});
