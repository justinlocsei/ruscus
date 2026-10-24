import { assert, it } from 'vitest';

import * as ruscus from './index.ts';

it('exposes a functional public API', () => {
  assert.equal(typeof ruscus.component, 'function');
  assert.equal(typeof ruscus.identifiers, 'function');
  assert.equal(typeof ruscus.queries, 'function');
  assert.equal(typeof ruscus.style, 'function');
  assert.equal(typeof ruscus.trait, 'function');
});
