import { fc } from '@fast-check/vitest';

const token = fc.constantFrom(
  'alfa',
  'bravo',
  'charlie',
  'delta',
  'echo'
);

const selectorSegment = fc.oneof(
  token,
  token.map(value => `.${value}`),
  fc.array(token, { minLength: 1, maxLength: 3 })
    .map(values => `:is(${values.join(', ')})`),
  token.map(value => `[data-${value}]`)
);

export const selectorList = fc
  .array(selectorSegment, { minLength: 1, maxLength: 4 })
  .map(parts => ({ selector: parts.join(', '), count: parts.length }));

export const anchorSelector = selectorList.map(({ selector }) => selector);

export const nestedSelectorKey = fc.oneof(
  token.map(value => `&:${value}`),
  token.map(value => `& .${value}`),
  fc.constant('& + &')
);
