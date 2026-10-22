import { assert, describe, it } from 'vitest';

import { defineComponent } from '../components.ts';
import { defineElement } from '../elements.ts';
import { CompactNaming } from './compact.ts';

describe('CompactNaming', () => {
  describe('forClass', () => {
    it('returns the hashed prefix for the component root', () => {
      const component = defineComponent('card');
      const naming = new CompactNaming(component.current);

      const name = naming.forClass([component.id]);
      assert.notEqual(name, 'card');

      assert.equal(
        name,
        naming.forClass([component.id])
      );
    });

    it('ignores missing element entries', () => {
      const definition = defineComponent('card').current;

      definition.elements = {
        body: defineElement().current,
        gap: undefined
      } as unknown as typeof definition.elements;

      const naming = new CompactNaming(definition);

      assert.match(naming.forClass([definition.id, 'body']), /_/);
    });

    it('throws for unknown element paths', () => {
      const naming = new CompactNaming(defineComponent('card').current);

      assert.throws(
        () => naming.forClass(['card', 'missing']),
        /Unknown element path for compact naming: card > missing/
      );
    });

    it('uses stable suffixes for registered elements', () => {
      const component = defineComponent('card').elements(e => ({
        body: e().children({ text: e() }),
        title: e()
      }));

      const naming = new CompactNaming(component.current);

      assert.match(
        naming.forClass([component.id, 'body']),
        /_0$/
      );

      assert.match(
        naming.forClass([component.id, 'body', 'text']),
        /_1$/
      );

      assert.match(
        naming.forClass([component.id, 'title']),
        /_2$/
      );
    });
  });

  describe('forVariant', () => {
    it('uses the shared variant naming convention', () => {
      const naming = new CompactNaming(defineComponent('card').current);

      assert.equal(naming.forVariant('compact'), 'is-compact');
    });
  });
});
