import { assert, describe, it } from 'vitest';

import {
  buildNestedContext,
  resolveGlobalProvider,
  resolveNestedProvider
} from './blocks.ts';
import { Component } from './components.ts';
import { defineAbsoluteFragment } from './fragments.ts';
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
      global: [],
      id: 'testing',
      identifiers: {},
      nested: [],
      styles: {}
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

      assert.deepEqual(elements.title?.styles, { color: 'red' });
      assert.deepEqual(elements.body?.styles, { margin: '0' });
    });

    it('supports lazy element providers', () => {
      const { current } = component().elements(e => ({
        title: () => e().css({ fontWeight: '700' })
      }));

      assert.deepEqual(current.elements.title?.styles, {
        fontWeight: '700'
      });
    });

    it('provides component-specific identifiers', () => {
      const instance = component()
        .identifiers({ alfa: 'string', bravo: 'variable' })
        .elements((e, { ids }) => ({
          body: e({ animationName: ids.alfa, gap: `var(${ids.bravo})` })
        }));

      assert.deepEqual(instance.current.elements.body?.styles, {
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
        'identifiers may only be set once'
      );
    });
  });

  describe('global', () => {
    it('registers global rules on the component', () => {
      const instance = component().global(s => ({
        '.card': s({ color: 'red' }),
        '@media (min-width: 768px)': s().nested({
          '.card': defineAbsoluteFragment({ display: 'block' })
        })
      }));

      const global = instance.current.global[0];
      assert.isDefined(global);

      const definitions = resolveGlobalProvider(
        global,
        styleContext(instance)
      );
      assert.equal(definitions['.card']?.scope, 'absolute');
      assert.deepEqual(definitions['.card']?.styles.root, { color: 'red' });

      assert.deepEqual(
        definitions['@media (min-width: 768px)']?.styles.nested['.card']
          ?.styles
          .root,
        { display: 'block' }
      );
    });

    it('can reference child elements', () => {
      const instance = component()
        .elements(e => ({ title: e() }))
        .global((s, { els }) => ({ [els.title]: s({ color: 'red' }) }));

      assert.equal(typeof instance.current.global[0], 'function');
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

    it('allows multiple global providers', () => {
      const instance = component()
        .global(s => ({ '.card': s({ color: 'black' }) }))
        .global(s => ({ '.card__title': s({ color: 'red' }) }));

      assert.equal(instance.current.global.length, 2);
    });
  });

  describe('nested', () => {
    it('registers nested rules on the component', () => {
      const instance = component().nested(s => ({
        '&:hover': s({ opacity: '0.5' }),
        a: s({ color: 'red' })
      }));

      const nested = instance.current.nested[0];
      assert.isDefined(nested);

      const definitions = resolveNestedProvider(
        nested,
        styleContext(instance)
      );

      assert.equal(definitions['&:hover']?.scope, 'relative');
      assert.deepEqual(
        definitions['&:hover']?.styles.root,
        { opacity: '0.5' }
      );

      assert.deepEqual(definitions.a?.styles.root, { color: 'red' });
    });

    it('can reference child elements', () => {
      const instance = component()
        .elements(e => ({ title: e() }))
        .nested((s, { els }) => ({ [els.title]: s({ color: 'red' }) }));

      assert.equal(typeof instance.current.nested[0], 'function');
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

    it('allows multiple nested providers', () => {
      const instance = component()
        .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
        .nested(s => ({ '&:focus': s({ outline: 'none' }) }));

      assert.equal(instance.current.nested.length, 2);
    });
  });

  describe('variants', () => {
    it('registers a variant provider', () => {
      const instance = component().variants(s => ({
        compact: s({ padding: '0.5rem' }),
        large: s({ padding: '2rem' })
      }));

      assert.equal(typeof instance.current.variants, 'function');
    });

    it('allows chaining after variants', () => {
      assert.deepEqual(
        component()
          .variants(s => ({ compact: s({ padding: '0.5rem' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when variants are defined more than once', () => {
      const instance = component().variants(s => ({
        compact: s({ padding: '0.5rem' })
      }));

      assert.throws(
        () => instance.variants(s => ({ large: s({ padding: '2rem' }) })),
        'variants may only be set once'
      );
    });
  });
});
