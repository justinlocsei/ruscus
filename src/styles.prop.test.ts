import { fc, test } from '@fast-check/vitest';
import { assert } from 'vitest';

import {
  camelToKebab,
  expandSelectorAnchor,
  mergeStyles,
  PropertyProjector,
  splitSelector
} from './styles.ts';
import { anchorSelector, selectorList } from './tests/properties/selectors.ts';
import { customPropertyName, declarations } from './tests/properties/styles.ts';

test.prop([selectorList])(
  'selector splitting preserves structured top-level lists',
  ({ selector, count }) => {
    assert.equal(splitSelector(selector).length, count);
    assert.isTrue(splitSelector(selector).every(part => part.length > 0));
  }
);

test.prop([fc.string().filter(value => !value.includes(','))])(
  'selector splitting preserves selectors without commas',
  selector => {
    assert.deepEqual(splitSelector(selector), [selector]);
  }
);

test.prop([anchorSelector])(
  'anchor expansion expands each anchor selector',
  anchor => {
    const expanded = expandSelectorAnchor(anchor, '&:hover');

    assert.equal(
      splitSelector(expanded).length,
      splitSelector(anchor).length
    );
    assert.notInclude(expanded, '&');
  }
);

test.prop([customPropertyName])(
  'custom properties are preserved when projecting camel-cased values',
  property => {
    assert.equal(camelToKebab(property), property);
  }
);

test.prop([fc.string()])(
  'property projection is stable',
  property => {
    const projector = new PropertyProjector();
    const projected = projector.project(property);

    assert.equal(projector.project(property), projected);

    if (!property.startsWith('--')) {
      assert.notMatch(projected, /[A-Z]/);
    }
  }
);

test.prop([declarations, declarations, declarations])(
  'style merging is associative and non-mutating',
  (alfa, bravo, charlie) => {
    const base = { ...alfa };

    const left = mergeStyles(mergeStyles(alfa, bravo), charlie);
    const right = mergeStyles(alfa, mergeStyles(bravo, charlie));

    assert.deepEqual(left, right);
    assert.deepEqual(alfa, base);
  }
);
