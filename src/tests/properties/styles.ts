import { fc } from '@fast-check/vitest';

import type { KnownProperty } from '../../types/css.ts';

// A CSS property name as used by Ruscus
const propertyName = fc.constantFrom<KnownProperty>(
  'accentColor',
  'backgroundColor',
  'color',
  'display',
  'fontSize',
  'margin',
  'padding',
  'outline',
  'outlineColor'
);

// A mapping of property names to values
export const declarations = fc.dictionary(
  propertyName,
  fc.string({ maxLength: 40 }),
  { maxKeys: 5 }
);

// A CSS custom property name
export const customPropertyName = fc
  .tuple(
    fc.constantFrom('alfa', 'bravo', 'charlie', 'delta'),
    fc.stringMatching(/[a-z-]{0,8}/)
  )
  .map(([prefix, suffix]) => `--${prefix}-${suffix}`);
