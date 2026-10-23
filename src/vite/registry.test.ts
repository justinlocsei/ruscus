import { assert, describe, it } from 'vitest';

import { ComponentRegistry } from './registry.ts';

describe('ComponentRegistry', () => {
  describe('claim', () => {
    it('allows a component ID to be registered by the same module', () => {
      const registry = new ComponentRegistry();

      registry.claim('alfa', '/styles/alfa.ts');
      registry.claim('alfa', '/styles/alfa.ts');
    });

    it('rejects a component ID owned by another module', () => {
      const registry = new ComponentRegistry();

      registry.claim('bravo', '/styles/bravo.ts');

      assert.throws(
        () => registry.claim('bravo', '/styles/charlie.ts'),
        /bravo.*bravo\.ts.*charlie\.ts/
      );
    });
  });

  describe('clear', () => {
    it('clears all registered IDs', () => {
      const registry = new ComponentRegistry();

      registry.claim('alfa', '/styles/alfa.ts');
      registry.clear();
      registry.claim('alfa', '/styles/bravo.ts');
    });
  });

  describe('release', () => {
    it('removes all IDs owned by a module', () => {
      const registry = new ComponentRegistry();

      registry.release('/styles/alfa.ts');
      registry.claim('alfa', '/styles/bravo.ts');

      registry.release('/styles/charlie.ts');
      registry.claim('delta', '/styles/echo.ts');
      registry.claim('foxtrot', '/styles/echo.ts');

      registry.release('/styles/echo.ts');
      registry.claim('delta', '/styles/golf.ts');
      registry.claim('foxtrot', '/styles/hotel.ts');
    });
  });
});
