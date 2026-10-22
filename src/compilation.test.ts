import { assert, describe, it } from 'vitest';

import type { CompileConfig } from './compilation.ts';
import { styleComponent } from './compilation.ts';
import type { AnyComponent } from './components.ts';
import { defineComponent, defineComponentNamespace } from './components.ts';
import { css } from './tests.ts';

function checkOutput(
  component: AnyComponent,
  expected: string,
  config: CompileConfig = {}
): void {
  assert.equal(styleComponent(component.current, config), expected);
}

describe('styleComponent', () => {
  it('returns empty CSS for a component with no styles', () => {
    checkOutput(defineComponent('empty'), '');
  });

  it('emits root styles', () => {
    checkOutput(
      defineComponent('card').css({ color: 'black', display: 'block' }),
      css`
        .card {
          color: black;
          display: block;
        }
      `
    );
  });

  it('emits element styles', () => {
    checkOutput(
      defineComponent('card')
        .css({ color: 'black' })
        .elements(e => ({
          body: e({ margin: '0' }),
          title: e().css({ color: 'red' })
        })),
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
    checkOutput(
      defineComponent('card').elements(e => ({
        line: e({ marginTop: '0' }).variants(s => ({
          bold: s({ fontWeight: '700' }),
          spacer: s({ marginTop: '1rem' })
        }))
      })),
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

  it('emits nested styles for the component', () => {
    checkOutput(
      defineComponent('card')
        .css({ display: 'block' })
        .elements(e => ({
          body: e(),
          title: e(),
          header: e().children({
            title: e()
          })
        }))
        .variants(s => ({ compact: s({ padding: '1rem' }) }))
        .nested((s, { els, variants: v }) => ({
          [v('compact')]: s({ gap: '0.5rem' }),
          [els.title]: s({ color: 'red' }),
          [els.header.root]: s({ color: 'black' }),
          [els.header.title]: s({ color: 'blue' })
        })),
      css`
        .card {
          display: block;
        }

        .card.is-compact {
          padding: 1rem;
        }

        .card.is-compact {
          gap: 0.5rem;
        }

        .card .card__title {
          color: red;
        }

        .card .card__header {
          color: black;
        }

        .card .card__header__title {
          color: blue;
        }
      `
    );
  });

  it('supports deeply nested styles', () => {
    checkOutput(
      defineComponent('card').elements(e => ({
        title: e(),
        body: e()
      })).nested((s, { els }) => ({
        [els.title]: s().nested({ a: s({ color: 'red' }) }),
        [els.body]: s({ fontWeight: '700' })
      })),
      css`
        .card .card__title {
          a {
            color: red;
          }
        }

        .card .card__body {
          font-weight: 700;
        }
      `
    );
  });

  it('emits global styles', () => {
    checkOutput(
      defineComponent('card').global(s => ({
        '.card': s({ color: 'black' }),
        '@media (min-width: 768px)': s().nested({
          '.card__title': s({ fontSize: '1rem' })
        })
      })),
      css`
        .card {
          color: black;
        }

        @media (min-width: 768px) {
          .card__title {
            font-size: 1rem;
          }
        }
      `
    );
  });

  it('provides identifiers to nested component styles', () => {
    checkOutput(
      defineComponent('card')
        .identifiers({ alfa: 'string' })
        .nested((s, { ids }) => ({
          '&:hover': s({ animationName: ids.alfa })
        })),
      css`
        .card:hover {
          animation-name: card--alfa;
        }
      `
    );
  });

  it('emits nested rules for variant combinations', () => {
    checkOutput(
      defineComponent('card').elements(e => ({
        body: e({ display: 'block' })
          .variants(s => ({
            compact: s({ padding: '0.5rem' }),
            large: s({ padding: '2rem' })
          }))
          .nested((s, { variants: v }) => ({
            [v('compact')]: s({ gap: '0.25rem' }),
            [v('compact', 'large')]: s({ gap: '1rem' })
          }))
      })),
      css`
        .card__body {
          display: block;
        }

        .card__body.is-compact {
          padding: 0.5rem;
        }

        .card__body.is-large {
          padding: 2rem;
        }

        .card__body.is-compact {
          gap: 0.25rem;
        }

        .card__body.is-compact.is-large {
          gap: 1rem;
        }
      `
    );
  });

  it('emits nested rules for an element', () => {
    checkOutput(
      defineComponent('card').elements(e => ({
        body: e({ display: 'block' })
          .children({ title: e() })
          .nested((s, { els }) => ({
            '&:hover': s({ opacity: '0.9' }),
            [els.title]: s({ color: 'red' })
          }))
      })),
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
    checkOutput(
      defineComponent('hero').elements(e => ({
        title: e().children({
          text: e({ color: 'red' })
        })
      })),
      css`
        .hero__title__text {
          color: red;
        }
      `
    );
  });

  it('emits styles for root variants', () => {
    checkOutput(
      defineComponent('card')
        .css({ padding: '1rem' })
        .variants(s => ({
          compact: s({ padding: '0.5rem' }),
          large: s({ padding: '2rem' })
        })),
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

  it('omits empty global fragments', () => {
    checkOutput(
      defineComponent('card')
        .css({ color: 'black' })
        .global(s => ({
          '.card': s(),
          '.card__title': s({ fontWeight: '700' })
        })),
      css`
        .card {
          color: black;
        }

        .card__title {
          font-weight: 700;
        }
      `
    );
  });

  it('omits empty variant styles', () => {
    checkOutput(
      defineComponent('card')
        .variants(s => ({
          compact: s({ padding: '0.5rem' }),
          empty: s()
        })),
      css`
        .card.is-compact {
          padding: 0.5rem;
        }
      `
    );
  });

  it('omits undefined declaration values', () => {
    checkOutput(
      defineComponent('card').css({
        color: 'black',
        display: undefined
      }),
      css`
        .card {
          color: black;
        }
      `
    );
  });

  it('respects custom indentation', () => {
    checkOutput(
      defineComponent('card').css({ color: 'black' }),
      css`
        .card {
            color: black;
        }
      `,
      { indentation: 4 }
    );
  });

  it('projects camelCase properties to kebab-case', () => {
    checkOutput(
      defineComponent('card').css({
        backgroundColor: 'white',
        fontSize: '1rem'
      }),
      css`
        .card {
          background-color: white;
          font-size: 1rem;
        }
      `
    );
  });

  it('supports namespaced components', () => {
    const c = defineComponentNamespace('ui');

    checkOutput(
      c('card').css({ color: 'black' }),
      css`
        .ui--card {
          color: black;
        }
      `
    );
  });
});
