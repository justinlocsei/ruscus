import { fc, test } from '@fast-check/vitest';
import { assert } from 'vitest';

import { defineComponent } from './components.ts';
import { CompactNaming } from './naming/compact.ts';
import { VerboseNaming } from './naming/verbose.ts';

const component = defineComponent('alfa').elements(e => ({
  body: e().children({
    icon: e()
  })
}));

const elementPath = fc.constantFrom(
  ['alfa'],
  ['alfa', 'body'],
  ['alfa', 'body', 'icon']
);

test.prop([elementPath])(
  'naming projections are deterministic',
  path => {
    const compact = new CompactNaming(component.current, 'ruscus-');
    const verbose = new VerboseNaming(component.current, 'ruscus-');

    const levels = [...path];

    assert.equal(compact.forClass(levels), compact.forClass(levels));
    assert.equal(verbose.forClass(levels), verbose.forClass(levels));
  }
);

test.prop([fc.constantFrom('alfa', 'bravo', 'charlie', 'delta')])(
  'naming prefixes are preserved',
  variant => {
    const compact = new CompactNaming(component.current, 'ruscus-');
    const verbose = new VerboseNaming(component.current, 'ruscus-');

    assert.isTrue(compact.forVariant(variant).startsWith('ruscus-'));
    assert.isTrue(verbose.forVariant(variant).startsWith('ruscus-'));
  }
);
