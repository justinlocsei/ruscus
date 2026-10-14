import { assert, describe, it } from 'vitest';

import { defineComponent } from './components.ts';
import { useNaming } from './naming.ts';

describe('useNaming', () => {
  it('uses verbose BEM names by default', () => {
    const component = defineComponent('card').elements(e => ({
      body: e()
    }));

    const name = useNaming(component);

    assert.equal(name(['card']), 'card');
    assert.equal(name(['card', 'body']), 'card__body');
  });

  it('uses a hashed prefix for compact root names', () => {
    const component = defineComponent('very-long-name');

    const verbose = useNaming(component, 'verbose');
    const compact = useNaming(component, 'compact');

    assert.isAbove(
      verbose([component.id]).length,
      compact([component.id]).length
    );
  });

  it('uses short suffixes for child elements', () => {
    const component = defineComponent('card').elements(e => ({
      title: e(),
      body: e()
    }));

    const name = useNaming(component, 'compact');

    assert.match(name([component.id, 'body']), /_a$/);
    assert.match(name([component.id, 'title']), /_b$/);
  });
});
