import { assert, describe, it } from 'vitest';

import { buildNestedContext, resolveNestedProvider } from './blocks.ts';
import { Component } from './components.ts';
import { defineFragment } from './fragments.ts';
import { buildIdentifiersContext } from './identifiers.ts';

describe('Component', () => {
  const component = () => new Component('testing');

  const styleContext = (instance: Component) => ({
    ...buildNestedContext([], instance.current.elements),
    ...buildIdentifiersContext(instance.id, instance.current.identifiers)
  });

  it('starts with an empty state', () => {
    assert.deepEqual(component().current, {
      elements: {},
      identifiers: {},
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

  describe('global', () => {
    it('registers global rules on the component', () => {
      const instance = component().global(s => ({
        '.card': s({ color: 'red' }),
        '@media (min-width: 768px)': s().nested({
          '.card': defineFragment({ display: 'block' })
        })
      }));

      const { global } = instance.current;
      assert.isDefined(global);

      const definitions = resolveNestedProvider(global, styleContext(instance));
      assert.deepEqual(definitions['.card']?.current.styles, { color: 'red' });

      assert.deepEqual(
        definitions['@media (min-width: 768px)']?.current.nested['.card']
          ?.current
          .styles,
        { display: 'block' }
      );
    });

    it('can reference child elements', () => {
      const instance = component()
        .elements(e => ({ title: e() }))
        .global((s, { els }) => ({ [els.title]: s({ color: 'red' }) }));

      assert.equal(typeof instance.current.global, 'function');
    });

    it('allows chaining', () => {
      assert.deepEqual(
        component()
          .global(s => ({ '.card': s({ color: 'black' }) }))
          .css({ display: 'block' })
          .current
          .styles,
        { display: 'block' }
      );
    });

    it('throws when global rules are defined more than once', () => {
      const instance = component().global(s => ({
        '.card': s({ color: 'black' })
      }));

      assert.throws(
        () => instance.global(s => ({ '.card': s({ color: 'red' }) })),
        'global may only be called once'
      );
    });
  });

  describe('nested', () => {
    it('registers nested rules on the component', () => {
      const instance = component().nested(s => ({
        '&:hover': s({ opacity: '0.5' }),
        a: s({ color: 'red' })
      }));

      const { nested } = instance.current;
      assert.isDefined(nested);

      const definitions = resolveNestedProvider(nested, styleContext(instance));

      assert.deepEqual(
        definitions['&:hover']?.current.styles,
        { opacity: '0.5' }
      );

      assert.deepEqual(definitions.a?.current.styles, { color: 'red' });
    });

    it('can reference child elements', () => {
      const instance = component()
        .elements(e => ({ title: e() }))
        .nested((s, { els }) => ({ [els.title]: s({ color: 'red' }) }));

      assert.equal(typeof instance.current.nested, 'function');
    });

    it('allows chaining', () => {
      assert.deepEqual(
        component()
          .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when nested rules are defined more than once', () => {
      const instance = component().nested(s => ({
        '&:hover': s({ opacity: '0.5' })
      }));

      assert.throws(
        () => instance.nested(s => ({ '&:focus': s({ outline: 'none' }) })),
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
