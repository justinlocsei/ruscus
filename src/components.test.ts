import { assert, describe, it } from 'vitest';

import { Component } from './components.ts';

describe('Component', () => {
  const component = () => new Component('testing');

  it('starts with an empty state', () => {
    assert.deepEqual(component().current, {
      elements: {},
      identifiers: {},
      nested: {},
      styles: {},
      variants: {}
    });
  });

  it('has an ID', () => {
    assert.equal(new Component('alfa').id, 'alfa');
    assert.equal(new Component('bravo').id, 'bravo');
  });

  it('can apply a namespace to the ID', () => {
    assert.equal(
      new Component('alfa', { namespace: 'bravo' }).id,
      'bravo--alfa'
    );

    assert.equal(
      new Component('alfa', { namespace: 'charlie' }).id,
      'charlie--alfa'
    );
  });

  describe('css', () => {
    it('adds styles to the component', () => {
      assert.deepEqual(
        component().css({ color: 'red' }).current.styles,
        { color: 'red' }
      );
    });

    it('merges styles', () => {
      assert.deepEqual(
        component()
          .css({ color: 'red' })
          .css({ background: 'blue' })
          .current
          .styles,
        { color: 'red', background: 'blue' }
      );
    });
  });

  describe('elements', () => {
    it('registers element instances for each name', () => {
      const { current: { elements } } = component().elements(e => ({
        body: e({ margin: '0' }),
        title: e().css({ color: 'red' })
      }));

      assert.deepEqual(elements.title?.current.styles, { color: 'red' });
      assert.deepEqual(elements.body?.current.styles, { margin: '0' });
    });

    it('supports lazy element providers', () => {
      const { current } = component().elements(e => ({
        title: () => e().css({ fontWeight: '700' })
      }));

      assert.deepEqual(current.elements.title?.current.styles, {
        fontWeight: '700'
      });
    });

    it('provides component-specific identifiers', () => {
      const instance = component()
        .identifiers({ alfa: 'string', bravo: 'variable' })
        .elements((e, { ids }) => ({
          body: e({ animationName: ids.alfa, gap: `var(${ids.bravo})` })
        }));

      assert.deepEqual(instance.current.elements.body?.current.styles, {
        animationName: 'testing--alfa',
        gap: 'var(--testing--bravo)'
      });
    });

    it('allows chaining after elements', () => {
      assert.deepEqual(
        component()
          .elements(e => ({ root: e({ display: 'block' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });
  });

  describe('identifiers', () => {
    it('registers component-specific identifiers', () => {
      assert.deepEqual(
        component()
          .identifiers({ alfa: 'string', bravo: 'variable' })
          .current
          .identifiers,
        { alfa: 'string', bravo: 'variable' }
      );
    });

    it('throws when identifiers are defined more than once', () => {
      const instance = component().identifiers({ alfa: 'string' });

      assert.throws(
        () => instance.identifiers({ bravo: 'variable' }),
        'identifiers may only be called once'
      );
    });
  });

  describe('nested', () => {
    it('registers nested rules on the component', () => {
      assert.deepEqual(
        component()
          .nested({
            '&:hover': { opacity: '0.5' },
            a: { color: 'red' }
          })
          .current
          .nested,
        {
          '&:hover': { opacity: '0.5' },
          a: { color: 'red' }
        }
      );
    });

    it('can reference child elements', () => {
      const instance = component()
        .elements(e => ({ title: e() }))
        .nested(({ els }) => ({ [els.title]: { color: 'red' } }));

      assert.equal(typeof instance.current.nested, 'function');
    });

    it('allows chaining', () => {
      assert.deepEqual(
        component()
          .nested({ '&:hover': { opacity: '0.5' } })
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when nested rules are defined more than once', () => {
      const instance = component().nested({ '&:hover': { opacity: '0.5' } });

      assert.throws(
        () => instance.nested({ '&:focus': { outline: 'none' } }),
        'nested may only be called once'
      );
    });
  });

  describe('variants', () => {
    it('registers styles for each variant name', () => {
      assert.deepEqual(
        component()
          .variants({
            compact: { padding: '0.5rem' },
            large: { padding: '2rem' }
          })
          .current
          .variants,
        {
          compact: { padding: '0.5rem' },
          large: { padding: '2rem' }
        }
      );
    });

    it('allows chaining after variants', () => {
      assert.deepEqual(
        component()
          .variants({ compact: { padding: '0.5rem' } })
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('resolves lazy variant definitions', () => {
      const padding = '0.5rem';

      assert.deepEqual(
        component()
          .variants(() => ({
            compact: { padding },
            large: { padding: '2rem' }
          }))
          .current
          .variants,
        {
          compact: { padding: '0.5rem' },
          large: { padding: '2rem' }
        }
      );
    });

    it('throws when variants are defined more than once', () => {
      const instance = component().variants({ compact: { padding: '0.5rem' } });

      assert.throws(
        () => instance.variants({ large: { padding: '2rem' } }),
        'variants may only be called once'
      );
    });
  });
});
