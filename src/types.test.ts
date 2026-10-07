import { describe, it } from 'vitest';

import { T } from './tests.ts';
import type { ElementSpec, PatchSpec } from './types.ts';

describe('PatchSpec', () => {
  it('replaces selected spec fields', () => {
    type Extended = ElementSpec & { traits: readonly string[] };

    T.assert<
      T.Equivalent<
        PatchSpec<Extended, { children: { label: ElementSpec } }>,
        {
          children: { label: ElementSpec };
          traits: readonly string[];
        }
      >
    >(true);
  });
});
