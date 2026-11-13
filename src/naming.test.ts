import { afterEach, assert, describe, it } from 'vitest';

import { defineComponent } from './components.ts';
import config, { configure } from './config.ts';
import { useNaming } from './naming.ts';

afterEach(() => {
  config.reset();
});

describe('useNaming', () => {
  it('uses verbose BEM names by default', () => {
    const component = defineComponent('card').elements(e => ({
      body: e()
    }));

    const name = useNaming(component.current);

    assert.equal(name.forClass(['card']), 'card');
    assert.equal(name.forClass(['card', 'body']), 'card__body');
    assert.equal(name.forVariant('compact'), 'is-compact');
  });

  it('uses a hashed prefix for compact root names', () => {
    const component = defineComponent('very-long-name');

    const verbose = useNaming(component.current, 'verbose');
    const compact = useNaming(component.current, 'compact');

    assert.isAbove(
      verbose.forClass([component.id]).length,
      compact.forClass([component.id]).length
    );

    assert.equal(
      compact.forClass([component.id]),
      compact.forClass([component.id])
    );
  });

  it('uses short suffixes for child elements', () => {
    const component = defineComponent('card').elements(e => ({
      title: e(),
      body: e()
    }));

    const name = useNaming(component.current, 'compact');

    assert.match(name.forClass([component.id, 'body']), /_0$/);
    assert.match(name.forClass([component.id, 'title']), /_1$/);
  });

  it('prepends a prefix from global configuration', () => {
    configure({ prefix: 'alfa-' });

    const component = defineComponent('card').elements(e => ({
      body: e()
    }));

    const name = useNaming(component.current);

    assert.equal(name.forClass(['card']), 'alfa-card');
    assert.equal(name.forClass(['card', 'body']), 'alfa-card__body');
    assert.equal(name.forVariant('compact'), 'alfa-is-compact');
  });

  it('respects the global naming configuration', () => {
    configure({ naming: 'compact' });

    const component = defineComponent('card').elements(e => ({
      body: e()
    }));

    const name = useNaming(component.current);

    assert.match(name.forClass([component.id, 'body']), /_0$/);
  });
});
