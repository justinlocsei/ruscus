import { describe, it } from 'vitest';

import { T } from './tests.ts';
import type {
  Block,
  ComponentSpec,
  ElementSpec,
  PatchComponentSpec,
  PatchElementSpec
} from './types.ts';

describe('Block', () => {
  it('rejects mixed declarations and nested rules', () => {
    type AssertBlock<T extends Block> = T;

    // @ts-expect-error mixed declaration and rule block
    type _Invalid = AssertBlock<{ color: 'red'; title: { color: 'blue' } }>;
  });
});

describe('PatchComponentSpec', () => {
  it('rejects invalid field types', () => {
    // @ts-expect-error invalid els patch
    type _Invalid = PatchComponentSpec<ComponentSpec, { els: boolean }>;
  });

  it('rejects unknown fields', () => {
    // @ts-expect-error unknown spec field
    type _Invalid = PatchComponentSpec<ComponentSpec, { meta: string }>;
  });

  it('replaces selected spec fields', () => {
    type Extended = ComponentSpec & { meta: string };

    T.assert<
      T.Equivalent<
        PatchComponentSpec<
          Extended,
          { els: { root: ElementSpec } }
        >,
        {
          els: { root: ElementSpec };
          meta: string;
          variants: never;
        }
      >
    >(true);
  });
});

describe('PatchElementSpec', () => {
  it('rejects invalid field types', () => {
    // @ts-expect-error invalid children patch
    type _Invalid = PatchElementSpec<ElementSpec, { children: boolean }>;
  });

  it('rejects unknown fields', () => {
    // @ts-expect-error unknown spec field
    type _Invalid = PatchElementSpec<ElementSpec, { meta: string }>;
  });

  it('replaces selected spec fields', () => {
    type Extended = ElementSpec & { traits: readonly string[] };

    T.assert<
      T.Equivalent<
        PatchElementSpec<
          Extended,
          { children: { label: ElementSpec } }
        >,
        {
          children: { label: ElementSpec };
          traits: readonly string[];
          variants: never;
        }
      >
    >(true);
  });
});
