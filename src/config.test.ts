import { afterEach, assert, describe, it } from 'vitest';

import type { ConfigOptions } from './config.ts';
import config, { configure } from './config.ts';

afterEach(() => {
  config.reset();
});

describe('Configuration', () => {
  it('returns a fallback when no value is set', () => {
    assert.equal(config.get('naming', 'verbose'), 'verbose');
  });

  it('returns set values', () => {
    config.set({ naming: 'compact' });

    assert.equal(config.get('naming', 'verbose'), 'compact');
  });

  it('merges successive updates', () => {
    config.set({ naming: 'compact' });
    config.set({ naming: 'verbose' });

    const values: Partial<ConfigOptions> = { naming: 'verbose' };

    assert.deepEqual({ naming: config.get('naming', 'compact') }, values);
  });

  it('clears values on reset', () => {
    config.set({ naming: 'compact' });
    config.reset();

    assert.equal(config.get('naming', 'verbose'), 'verbose');
  });
});

describe('configure', () => {
  it('updates global configuration', () => {
    configure({ naming: 'compact' });
    assert.equal(config.get('naming', 'verbose'), 'compact');
  });
});
