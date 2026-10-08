import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';
import { styleComponent } from './css.ts';

describe('styleComponent', () => {
  it('returns empty CSS for a component with no styles', () => {
    assert.equal(styleComponent(new Component('empty')), '');
  });

  it('emits root styles', () => {
    const css = styleComponent(
      new Component('card').css({ color: 'black', display: 'block' })
    );

    assert.equal(
      css,
      [
        '.card {',
        '  color: black;',
        '  display: block;',
        '}'
      ].join('\n')
    );
  });

  it('skips undefined properties', () => {
    const css = styleComponent(
      new Component('card').css({ color: 'black', display: undefined })
    );

    assert.equal(
      css,
      [
        '.card {',
        '  color: black;',
        '}'
      ].join('\n')
    );
  });

  it('emits element styles with BEM-style selectors', () => {
    const css = styleComponent(
      new Component('card')
        .css({ color: 'black' })
        .elements(e => ({
          body: e({ margin: '0' }),
          title: e().css({ color: 'red' })
        }))
    );

    assert.equal(
      css,
      [
        '.card {',
        '  color: black;',
        '}',
        '',
        '.card__body {',
        '  margin: 0;',
        '}',
        '',
        '.card__title {',
        '  color: red;',
        '}'
      ].join('\n')
    );
  });

  it('emits nested element styles', () => {
    const css = styleComponent(
      new Component('hero').elements(e => ({
        title: e().children(n => ({
          text: n({ color: 'red' })
        }))
      }))
    );

    assert.equal(
      css,
      [
        '.hero__title__text {',
        '  color: red;',
        '}'
      ].join('\n')
    );
  });

  it('respects custom indentation', () => {
    const css = styleComponent(
      new Component('card').css({ color: 'black' }),
      { indentation: 4 }
    );

    assert.equal(
      css,
      [
        '.card {',
        '    color: black;',
        '}'
      ].join('\n')
    );
  });

  it('projects camelCase properties to kebab-case', () => {
    const css = styleComponent(
      new Component('card').css({
        backgroundColor: 'white',
        fontSize: '1rem'
      })
    );

    assert.equal(
      css,
      [
        '.card {',
        '  background-color: white;',
        '  font-size: 1rem;',
        '}'
      ].join('\n')
    );
  });

  it('uses the full component ID', () => {
    const css = styleComponent(
      new Component('card', { namespace: 'ui' }).css({ color: 'black' })
    );

    assert.equal(
      css,
      [
        '.ui--card {',
        '  color: black;',
        '}'
      ].join('\n')
    );
  });
});
