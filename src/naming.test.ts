import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';
import { styleComponent } from './css.ts';
import {
  createVerboseNameGenerator,
  hashComponentId,
  useNaming
} from './naming.ts';
import { projectComponent } from './projection.ts';

describe('hashComponentId', () => {
  it('is stable for the same id', () => {
    assert.equal(hashComponentId('card'), hashComponentId('card'));
  });

  it('differs for different ids', () => {
    assert.notEqual(hashComponentId('alfa'), hashComponentId('bravo'));
  });
});

describe('useNaming', () => {
  it('uses verbose BEM names by default', () => {
    const component = new Component('card').elements(e => ({
      body: e()
    }));
    const name = useNaming(component);

    assert.equal(name(['card', 'body']), 'card__body');
    assert.equal(name(['card']), 'card');
  });

  it('uses a hashed prefix for compact root names', () => {
    const name = useNaming(new Component('card'), 'compact');

    assert.equal(name(['card']), hashComponentId('card'));
  });

  it('assigns predictable local suffixes in sorted path order', () => {
    const component = new Component('card').elements(e => ({
      body: e(),
      title: e()
    }));
    const name = useNaming(component, 'compact');
    const prefix = hashComponentId('card');

    assert.equal(name(['card', 'body']), `${prefix}_a`);
    assert.equal(name(['card', 'title']), `${prefix}_b`);
  });
});

describe('createVerboseNameGenerator', () => {
  it('matches buildSelector behavior without a leading dot', () => {
    const name = createVerboseNameGenerator();

    assert.equal(name(['card', 'body']), 'card__body');
    assert.equal(name(['card']), 'card');
  });
});

describe('compact naming with compile and projection', () => {
  it('emits CSS and class names from the same scheme', () => {
    const component = new Component('card')
      .css({ display: 'block' })
      .elements(e => ({
        body: e({ margin: '0' }),
        title: e().css({ fontWeight: '700' })
      }))
      .variants(s => ({ compact: s({ padding: '0.5rem' }) }));

    const prefix = hashComponentId('card');
    const css = styleComponent(component, { naming: 'compact' });
    const applied = projectComponent(component, { naming: 'compact' });

    assert.equal(applied.root('compact'), `${prefix} is-compact`);
    assert.equal(applied.body, `${prefix}_a`);
    assert.equal(applied.title, `${prefix}_b`);

    assert.match(css, new RegExp(`\\.${prefix} \\{`));
    assert.match(css, new RegExp(`\\.${prefix}_a \\{`));
    assert.match(css, new RegExp(`\\.${prefix}\\.is-compact \\{`));
  });
});
