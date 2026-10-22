import { assert, describe, it } from 'vitest';

import { ComponentRegistry } from './registry.ts';

describe('ComponentRegistry', () => {
  describe('clear', () => {
    it('clears all registered IDs', () => {
      const registry = new ComponentRegistry();

      registry.register('alfa', '/styles/alfa.ts');
      registry.clear();
      registry.register('alfa', '/styles/bravo.ts');
    });
  });

  describe('register', () => {
    it('allows a component ID to be registered by the same module', () => {
      const registry = new ComponentRegistry();

      registry.register('alfa', '/styles/alfa.ts');
      registry.register('alfa', '/styles/alfa.ts');
    });

    it('rejects a component ID owned by another module', () => {
      const registry = new ComponentRegistry();

      registry.register('bravo', '/styles/bravo.ts');

      assert.throws(
        () => registry.register('bravo', '/styles/charlie.ts'),
        /bravo.*bravo\.ts.*charlie\.ts/
      );
    });
  });

  describe('remove', () => {
    it('removes all IDs owned by a module', () => {
      const registry = new ComponentRegistry();

      registry.remove('/styles/alfa.ts');
      registry.register('alfa', '/styles/bravo.ts');

      registry.remove('/styles/charlie.ts');
      registry.register('delta', '/styles/echo.ts');
      registry.register('foxtrot', '/styles/echo.ts');

      registry.remove('/styles/echo.ts');
      registry.register('delta', '/styles/golf.ts');
      registry.register('foxtrot', '/styles/hotel.ts');
    });
  });
});
