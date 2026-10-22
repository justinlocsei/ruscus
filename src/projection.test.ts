import { assert, describe, it } from 'vitest';

import { defineComponent } from './components.ts';
import { useNaming } from './naming.ts';
import { projectComponent } from './projection.ts';
import { T } from './tests.ts';

describe('projectComponent', () => {
  it('projects root and element class names', () => {
    const component = defineComponent('card').elements(e => ({
      header: e(),
      body: e().children({
        title: e()
      })
    }));

    const els = projectComponent(component, useNaming(component.current));

    assert.equal(els.root, 'card');
    assert.equal(els.header, 'card__header');
    assert.equal(els.body.root, 'card__body');
    assert.equal(els.body.title, 'card__body__title');
  });

  it('projects root and element variants', () => {
    const component = defineComponent('card')
      .elements(e => ({
        body: e().variants(s => ({
          compact: s({ padding: '0.5rem' })
        }))
      }))
      .variants(s => ({
        active: s({ color: 'red' })
      }));

    const els = projectComponent(component, useNaming(component.current));

    assert.equal(els.root('active'), 'card is-active');
    assert.equal(els.body('compact'), 'card__body is-compact');
  });

  it('uses narrow element types on the projection', () => {
    const component = defineComponent('card')
      .identifiers({ alfa: 'string' })
      .elements(e => ({ body: e() }))
      .variants(s => ({ compact: s({}) }));

    const applied = projectComponent(component, useNaming(component.current));

    T.assert<T.Equivalent<typeof applied.root, (name: 'compact') => string>>(
      true
    );

    T.assert<T.Equivalent<typeof applied.body, string>>(true);

    // @ts-expect-error unknown element
    applied.title;
  });
});
