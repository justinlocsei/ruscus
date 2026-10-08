import { assert, describe, it } from 'vitest';

import { resolveVariants } from './variants.ts';

describe('resolveVariants', () => {
  it('resolves eager variant styles', () => {
    assert.deepEqual(
      resolveVariants({
        alfa: { color: 'red' },
        bravo: { color: 'blue' }
      }),
      {
        alfa: { color: 'red' },
        bravo: { color: 'blue' }
      }
    );
  });

  it('resolves a lazy variant map', () => {
    const gap = '1rem';

    assert.deepEqual(
      resolveVariants(() => ({
        compact: { padding: gap },
        large: { padding: `calc(${gap} * 2)` }
      })),
      {
        compact: { padding: '1rem' },
        large: { padding: 'calc(1rem * 2)' }
      }
    );
  });
});
