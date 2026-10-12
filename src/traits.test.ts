import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';
import { styleComponent } from './css.ts';
import { css } from './tests.ts';
import { defineTrait, resolveTrait } from './traits.ts';

describe('defineTrait', () => {
  it('resolves to a relative fragment', () => {
    const link = defineTrait(s =>
      s({ color: 'blue' }).nested({
        '&:hover': s({ textDecoration: 'underline' })
      })
    );

    assert.deepEqual(resolveTrait(link).current.styles, { color: 'blue' });
    assert.deepEqual(
      resolveTrait(link).current.nested['&:hover']?.current.styles,
      { textDecoration: 'underline' }
    );
  });
});

describe('Component.is', () => {
  it('merges trait styles onto the root', () => {
    const link = defineTrait(s => s({ color: 'blue' }));

    assert.deepEqual(
      new Component('card').is(link).current.styles,
      { color: 'blue' }
    );
  });

  it('appends trait nested rules as providers', () => {
    const link = defineTrait(s =>
      s().nested({ '&:hover': s({ opacity: '0.8' }) })
    );

    assert.equal(
      new Component('card').is(link).current.nested.length,
      1
    );
  });
});

describe('styleComponent', () => {
  it('emits trait styles and nested rules', () => {
    const link = defineTrait(s =>
      s({ color: 'blue' }).nested({
        '&:hover': s({ textDecoration: 'underline' })
      })
    );

    const output = styleComponent(
      new Component('card')
        .css({ display: 'block' })
        .is(link)
    );

    assert.equal(
      output,
      css`
        .card {
          display: block;
          color: blue;
        }

        .card:hover {
          text-decoration: underline;
        }
      `
    );
  });

  it('emits nested providers in registration order', () => {
    const output = styleComponent(
      new Component('card')
        .is(defineTrait(s =>
          s().nested({
            '&:hover': s({ color: 'red' })
          })
        ))
        .nested(s => ({
          '&:hover': s({ color: 'blue' })
        }))
    );

    assert.equal(
      output,
      css`
        .card:hover {
          color: red;
        }

        .card:hover {
          color: blue;
        }
      `
    );
  });

  it('emits trait styles on elements', () => {
    const breakout = defineTrait(s => s({ marginLeft: '-1rem' }));

    const output = styleComponent(
      new Component('card').elements(e => ({
        body: e().is(breakout)
      }))
    );

    assert.equal(
      output,
      css`
        .card__body {
          margin-left: -1rem;
        }
      `
    );
  });
});
