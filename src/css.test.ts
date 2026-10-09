import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';
import { styleComponent } from './css.ts';
import { css } from './tests.ts';

describe('styleComponent', () => {
  it('returns empty CSS for a component with no styles', () => {
    assert.equal(styleComponent(new Component('empty')), '');
  });

  it('emits root styles', () => {
    const output = styleComponent(
      new Component('card').css({ color: 'black', display: 'block' })
    );

    assert.equal(
      output,
      css`
        .card {
          color: black;
          display: block;
        }
      `
    );
  });

  it('emits element styles', () => {
    const output = styleComponent(
      new Component('card')
        .css({ color: 'black' })
        .elements(e => ({
          body: e({ margin: '0' }),
          title: e().css({ color: 'red' })
        }))
    );

    assert.equal(
      output,
      css`
        .card {
          color: black;
        }

        .card__body {
          margin: 0;
        }

        .card__title {
          color: red;
        }
      `
    );
  });

  it('emits styles for element variants', () => {
    const output = styleComponent(
      new Component('card').elements(e => ({
        line: e({ marginTop: '0' }).variants({
          bold: { fontWeight: '700' },
          spacer: { marginTop: '1rem' }
        })
      }))
    );

    assert.equal(
      output,
      css`
        .card__line {
          margin-top: 0;
        }

        .card__line.is-bold {
          font-weight: 700;
        }

        .card__line.is-spacer {
          margin-top: 1rem;
        }
      `
    );
  });

  it('emits nested rules for an element', () => {
    const output = styleComponent(
      new Component('card').elements(e => ({
        body: e({ display: 'block' })
          .children({ title: e() })
          .nested(({ els }) => ({
            '&:hover': { opacity: '0.9' },
            [els.title]: { color: 'red' }
          }))
      }))
    );

    assert.equal(
      output,
      css`
        .card__body {
          display: block;
        }

        .card__body:hover {
          opacity: 0.9;
        }

        .card__body .card__body__title {
          color: red;
        }
      `
    );
  });

  it('emits nested element styles', () => {
    const output = styleComponent(
      new Component('hero').elements(e => ({
        title: e().children({
          text: e({ color: 'red' })
        })
      }))
    );

    assert.equal(
      output,
      css`
        .hero__title__text {
          color: red;
        }
      `
    );
  });

  it('emits styles for root variants', () => {
    const output = styleComponent(
      new Component('card')
        .css({ padding: '1rem' })
        .variants({
          compact: { padding: '0.5rem' },
          large: { padding: '2rem' }
        })
    );

    assert.equal(
      output,
      css`
        .card {
          padding: 1rem;
        }

        .card.is-compact {
          padding: 0.5rem;
        }

        .card.is-large {
          padding: 2rem;
        }
      `
    );
  });

  it('respects custom indentation', () => {
    const output = styleComponent(
      new Component('card').css({ color: 'black' }),
      { indentation: 4 }
    );

    assert.equal(
      output,
      css`
        .card {
            color: black;
        }
      `
    );
  });

  it('projects camelCase properties to kebab-case', () => {
    const output = styleComponent(
      new Component('card').css({
        backgroundColor: 'white',
        fontSize: '1rem'
      })
    );

    assert.equal(
      output,
      css`
        .card {
          background-color: white;
          font-size: 1rem;
        }
      `
    );
  });

  it('uses the full component ID', () => {
    const output = styleComponent(
      new Component('card', { namespace: 'ui' }).css({ color: 'black' })
    );

    assert.equal(
      output,
      css`
        .ui--card {
          color: black;
        }
      `
    );
  });
});
