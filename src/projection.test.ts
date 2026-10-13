import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';
import { buildPlan } from './internal.ts';
import { T } from './tests.ts';

describe('Component.apply', () => {
  it('projects root and element class names', () => {
    const applied = new Component('card')
      .elements(e => ({
        header: e(),
        body: e().children({
          title: e()
        })
      }))
      .apply();

    assert.equal(applied.root, 'card');
    assert.equal(applied.header, 'card__header');
    assert.equal(applied.body.root, 'card__body');
    assert.equal(applied.body.title, 'card__body__title');
  });

  it('projects root and element variants', () => {
    const applied = new Component('card')
      .elements(e => ({
        body: e().variants(s => ({
          compact: s({ padding: '0.5rem' })
        }))
      }))
      .variants(s => ({
        active: s({ color: 'red' })
      }))
      .apply();

    assert.equal(applied.root('active'), 'card is-active');
    assert.equal(applied.body('compact'), 'card__body is-compact');
  });

  it('projects identifiers as a callable surface', () => {
    const applied = new Component('card')
      .identifiers({ alfaBeta: 'string', bravo: 'variable' })
      .apply();

    assert.equal(applied('alfaBeta'), 'card--alfa-beta');
    assert.equal(applied('bravo'), '--card--bravo');
  });

  it('attaches the component and CSS compiler under the internal symbol', () => {
    const component = new Component('card').css({ color: 'red' });
    const applied = component.apply();

    assert.strictEqual(applied[buildPlan].component, component);
    assert.equal(
      applied[buildPlan].compile(),
      '.card {\n  color: red;\n}'
    );
  });
});

describe('Applied', () => {
  it('types the projected surface', () => {
    const applied = new Component('card')
      .identifiers({ alfa: 'string' })
      .elements(e => ({ body: e() }))
      .variants(s => ({ compact: s({}) }))
      .apply();

    T.assert<T.Equivalent<typeof applied.root, (name: 'compact') => string>>(
      true
    );
    T.assert<T.Equivalent<typeof applied.body, string>>(true);

    // @ts-expect-error unknown element
    applied.title;

    // @ts-expect-error unknown identifier
    applied('bravo');
  });

  it('does not make a component without identifiers callable', () => {
    const applied = new Component('card').apply();

    type IsCallable<T> = T extends (...args: never[]) => unknown ? true
      : false;

    T.assert<T.Equivalent<IsCallable<typeof applied>, false>>(true);
  });
});
