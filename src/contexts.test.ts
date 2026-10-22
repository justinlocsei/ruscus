import { assert, describe, it } from 'vitest';

import { defineComponent } from './components.ts';
import { buildComponentContext, buildElementContext } from './contexts.ts';
import { defineElement } from './elements.ts';
import { useNaming } from './naming.ts';
import { ELEMENT_ROOT } from './types/ids.ts';

const e = defineElement;

describe('buildComponentContext', () => {
  it('exposes a context for building a component', () => {
    const component = defineComponent('card')
      .identifiers({ alfa: 'string' })
      .elements(e => ({ body: e() }))
      .variants(s => ({ compact: s({}) }));

    const name = useNaming(component.current);
    const context = buildComponentContext(component.current, { name });

    assert.equal(context.ids.alfa, 'card--alfa');
    assert.equal(context.els.body as unknown as string, '.card__body');
    assert.equal(context.variants('compact'), '&.is-compact');

    assert.equal(
      (context.els[ELEMENT_ROOT] as (variant: string) => string)('compact'),
      '.card.is-compact'
    );
  });
});

describe('buildElementContext', () => {
  it('exposes a context for building an element', () => {
    const body = defineElement()
      .children({ text: e({ color: 'red' }) })
      .variants(s => ({ compact: s({}) }));

    const name = useNaming(defineComponent('card').current);

    const context = buildElementContext(
      ['card', 'body'],
      body.current,
      { name }
    );

    assert.equal(context.els.text as unknown as string, '.card__body__text');
    assert.equal(context.variants('compact'), '&.is-compact');

    assert.equal(
      (context.els[ELEMENT_ROOT] as (variant: string) => string)('compact'),
      '.card__body.is-compact'
    );
  });
});
