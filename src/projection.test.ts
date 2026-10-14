import { assert, describe, it } from 'vitest';

import { defineComponent } from './components.ts';
import { projectComponent } from './projection.ts';
import { T } from './tests.ts';

describe('projectComponent', () => {
  it('projects root and element class names', () => {
    const els = projectComponent(
      defineComponent('card')
        .elements(e => ({
          header: e(),
          body: e().children({
            title: e()
          })
        }))
    );

    assert.equal(els.root, 'card');
    assert.equal(els.header, 'card__header');
    assert.equal(els.body.root, 'card__body');
    assert.equal(els.body.title, 'card__body__title');
  });

  it('projects root and element variants', () => {
    const els = projectComponent(
      defineComponent('card')
        .elements(e => ({
          body: e().variants(s => ({
            compact: s({ padding: '0.5rem' })
          }))
        }))
        .variants(s => ({
          active: s({ color: 'red' })
        }))
    );

    assert.equal(els.root('active'), 'card is-active');
    assert.equal(els.body('compact'), 'card__body is-compact');
  });

  it('projects identifiers', () => {
    const ids = projectComponent(
      defineComponent('card')
        .identifiers({ alfaBeta: 'string', bravo: 'variable' })
        .elements(e => ({ body: e() }))
    );

    assert.equal(ids('alfaBeta'), 'card--alfa-beta');
    assert.equal(ids('bravo'), '--card--bravo');

    assert.equal(ids.root, 'card');
    assert.equal(ids.body, 'card__body');
  });

  it('uses narrow element types on the projection', () => {
    const applied = projectComponent(
      defineComponent('card')
        .identifiers({ alfa: 'string' })
        .elements(e => ({ body: e() }))
        .variants(s => ({ compact: s({}) }))
    );

    T.assert<T.Equivalent<typeof applied.root, (name: 'compact') => string>>(
      true
    );

    T.assert<T.Equivalent<typeof applied.body, string>>(true);

    // @ts-expect-error unknown element
    applied.title;

    // @ts-expect-error unknown identifier
    applied('bravo');
  });
});
