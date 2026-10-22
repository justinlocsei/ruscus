import { assert, describe, it } from 'vitest';

import type { AnyComponent } from './components.ts';
import {
  Component,
  defineComponent,
  defineComponentNamespace
} from './components.ts';
import { buildComponentContext } from './contexts.ts';
import { defineAbsoluteFragment, defineRelativeFragment } from './fragments.ts';
import { extractBuildPlan } from './internal.ts';
import { useNaming } from './naming.ts';
import { T } from './tests.ts';
import { defineTrait } from './traits.ts';
import type { ScopedFragments } from './types/fragments.ts';

describe('Component', () => {
  const component = () => new Component('testing');

  const styleContext = (instance: AnyComponent) =>
    buildComponentContext(instance.current, {
      name: useNaming(instance.current, 'verbose')
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

  describe('apply', () => {
    it('projects an applicable component', () => {
      const projection = component()
        .css({ color: 'black' })
        .apply();

      assert.equal(projection.root as unknown as string, 'testing');

      const buildPlan = extractBuildPlan(projection);
      assert.isDefined(buildPlan);
      assert.equal(typeof buildPlan.compile, 'function');
    });
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
    it('registers named elements', () => {
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

    it('can reference component-specific identifiers', () => {
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

    it('supports chaining', () => {
      assert.deepEqual(
        component()
          .elements(e => ({ root: e({ display: 'block' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('throws when elements are defined more than once', () => {
      const instance = component().elements(e => ({
        body: e({ margin: '0' })
      }));

      assert.throws(
        () => instance.elements(e => ({ title: e() })),
        'elements may only be set once'
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

  describe('is', () => {
    it('applies trait styles', () => {
      const instance = component().is(
        defineTrait(s => s({ color: 'blue' }))
      );

      assert.deepEqual(instance.current.styles, { color: 'blue' });
      assert.equal(instance.current.nested.length, 0);
    });

    it('registers nested trait styles', () => {
      const instance = component().is(
        defineTrait(s => s().nested({ '&:hover': s({ opacity: '0.5' }) }))
      );

      assert.equal(instance.current.nested.length, 1);

      assert.deepEqual(
        (instance.current.nested[0] as () => ScopedFragments)()['&:hover']
          ?.styles.root,
        { opacity: '0.5' }
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

      const context = styleContext(instance);
      const definitions = global(defineAbsoluteFragment, context);
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

    it('exposes narrowly typed elements to the global provider', () => {
      component()
        .elements(e => ({ title: e() }))
        .global((s, { els }) => {
          T.assert<T.Equivalent<typeof els.title, string>>(true);

          // @ts-expect-error unknown element
          els.footer;

          return { [els.title]: s({ color: 'red' }) };
        });
    });

    it('supports chaining', () => {
      assert.deepEqual(
        component()
          .global(s => ({ '.card': s({ color: 'black' }) }))
          .css({ display: 'block' })
          .current
          .styles,
        { display: 'block' }
      );
    });

    it('can be called multiple times', () => {
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

      const context = styleContext(instance);
      const definitions = nested(defineRelativeFragment, context);

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

    it('exposes deeply nested elements to the nested provider', () => {
      component()
        .elements(e => ({
          header: () =>
            e().children(() => ({
              title: e().children(() => ({ text: e() }))
            }))
        }))
        .nested((s, { els }) => {
          T.assert<
            T.Equivalent<typeof els.header.title.text, string>
          >(true);

          // @ts-expect-error unknown element
          els.header.title.footer;

          return { [els.header.title.text]: s({ color: 'red' }) };
        });
    });

    it('exposes element variants on the nested provider', () => {
      component()
        .elements(e => ({
          body: e().variants(s => ({
            compact: s({ padding: '0.5rem' }),
            large: s({ padding: '2rem' })
          }))
        }))
        .nested((s, { els }) => {
          T.assert<
            T.Equivalent<
              typeof els.body,
              (name: 'compact' | 'large') => string
            >
          >(true);

          // @ts-expect-error unknown element
          els.title;

          return {
            [els.body('compact')]: s({ gap: '0.25rem' })
          };
        });
    });

    it('exposes narrowly typed elements to the nested provider', () => {
      component()
        .elements(e => ({ title: e() }))
        .nested((s, { els }) => {
          T.assert<T.Equivalent<typeof els.title, string>>(true);

          // @ts-expect-error unknown element
          els.footer;

          return {
            '&:hover': s({ opacity: '0.9' }),
            [els.title]: s({ color: 'red' })
          };
        });
    });

    it('exposes root variants on the nested provider', () => {
      component()
        .elements(e => ({ body: e() }))
        .variants(s => ({
          compact: s({ padding: '0.5rem' }),
          large: s({ padding: '2rem' })
        }))
        .nested((s, { els, variants }) => {
          T.assert<
            T.Equivalent<
              typeof els.root,
              (name: 'compact' | 'large') => string
            >
          >(true);

          T.assert<T.Equivalent<typeof els.body, string>>(true);

          T.assert<
            T.Equivalent<
              typeof variants,
              <T extends 'compact' | 'large'>(...names: T[]) => string
            >
          >(true);

          // @ts-expect-error unknown element
          els.title;

          // @ts-expect-error unknown variant
          variants('wide');

          return {
            [variants('compact')]: s({ gap: '0.25rem' }),
            [els.body]: s({ display: 'block' })
          };
        });
    });

    it('supports chaining', () => {
      assert.deepEqual(
        component()
          .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
          .css({ color: 'black' })
          .current
          .styles,
        { color: 'black' }
      );
    });

    it('can be called multiple times', () => {
      const instance = component()
        .nested(s => ({ '&:hover': s({ opacity: '0.5' }) }))
        .nested(s => ({ '&:focus': s({ outline: 'none' }) }));

      assert.equal(instance.current.nested.length, 2);
    });
  });

  describe('variants', () => {
    it('register component variants', () => {
      const instance = component().variants(s => ({
        compact: s({ padding: '0.5rem' }),
        large: s({ padding: '2rem' })
      }));

      assert.equal(typeof instance.current.variants, 'function');
    });

    it('supports chaining', () => {
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

describe('defineComponent', () => {
  it('creates a component', () => {
    const component = defineComponent('title');
    assert.equal(component.id, 'title');
  });
});

describe('defineComponentNamespace', () => {
  it('creates a factory for namespaced components', () => {
    const c = defineComponentNamespace('ui', 'admin');

    assert.equal(c('card').id, 'ui--admin--card');
    assert.equal(c('badge').id, 'ui--admin--badge');
  });
});
