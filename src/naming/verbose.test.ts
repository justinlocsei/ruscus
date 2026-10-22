import { assert, describe, it } from 'vitest';

import { defineComponent } from '../components.ts';
import { VerboseNaming } from './verbose.ts';

describe('VerboseNaming', () => {
  describe('forClass', () => {
    it('joins levels with double underscores', () => {
      const naming = new VerboseNaming(defineComponent('card').current);

      assert.equal(naming.forClass(['card']), 'card');
      assert.equal(
        naming.forClass(['card', 'body', 'text']),
        'card__body__text'
      );
    });
  });

  describe('forVariant', () => {
    it('uses the shared variant naming convention', () => {
      const naming = new VerboseNaming(defineComponent('card').current);

      assert.equal(naming.forVariant('compact'), 'is-compact');
    });
  });
});
