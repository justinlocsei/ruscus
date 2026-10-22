import { assert, describe, it } from 'vitest';

import { defineComponent } from '../components.ts';
import { useNaming } from '../naming.ts';
import { createVariantProjector, projectTree } from './elements.ts';

describe('createVariantProjector', () => {
  it('joins class name variants with spaces', () => {
    const name = useNaming(defineComponent('card').current);
    const project = createVariantProjector('card', 'names', name);

    assert.equal(project('compact'), 'card is-compact');
    assert.equal(project('compact', 'large'), 'card is-compact is-large');
  });

  it('joins selector variants without spaces', () => {
    const name = useNaming(defineComponent('card').current);
    const project = createVariantProjector('.card', 'selectors', name);

    assert.equal(project('compact'), '.card.is-compact');
    assert.equal(project('compact', 'large'), '.card.is-compact.is-large');
  });
});

describe('projectTree', () => {
  it('can project class names for each element in the tree', () => {
    const { current } = defineComponent('card').elements(e => ({
      body: e().children({ text: e() })
    }));

    const name = useNaming(current);

    const tree = projectTree(
      [current.id],
      current.elements,
      {
        format: 'names',
        hasVariants: false,
        name
      }
    ) as unknown as {
      body: { root: string; text: string };
      root: string;
    };

    assert.equal(tree.root, 'card');
    assert.equal(tree.body.root, 'card__body');
    assert.equal(tree.body.text, 'card__body__text');
  });

  it('can project selectors for each element in the tree', () => {
    const { current } = defineComponent('card').elements(e => ({
      body: e()
    }));

    const name = useNaming(current);

    const tree = projectTree(
      [current.id],
      current.elements,
      {
        format: 'selectors',
        hasVariants: true,
        name
      }
    ) as unknown as {
      body: string;
      root: (variant: string) => string;
    };

    assert.equal(tree.root('active'), '.card.is-active');
    assert.equal(tree.body, '.card__body');
  });
});
