import { fc } from '@fast-check/vitest';

// Values that can be both raw and composed selectors
const token = fc.constantFrom(
  'button',
  'div',
  'input',
  'p',
  'span'
);

// A segment in a CSS selector
const selectorSegment = fc.oneof(
  token,
  token.map(t => `.${t}`),
  fc.array(token, { minLength: 1, maxLength: 3 })
    .map(ts => `:is(${ts.join(', ')})`),
  token.map(t => `[data-${t}]`)
);

// A comma-separated list of selectors
export const selectorList = fc
  .array(selectorSegment, { minLength: 1, maxLength: 4 })
  .map(ps => ({ selector: ps.join(', '), count: ps.length }));

// A selector that can be used as an anchor
export const anchorSelector = selectorList.map(({ selector }) => selector);

// A key for a nested selector
export const nestedSelectorKey = fc.oneof(
  token.map(value => `&:${value}`),
  token.map(value => `& .${value}`),
  fc.constant('& + &')
);
