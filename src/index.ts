export type { StyleComponentsConfig } from './compilation.ts';
export { styleComponents as compile } from './compilation.ts';
export { defineComponent as component } from './components.ts';
export { extractIdentifiers as identifiers } from './internal.ts';
export { defineQueries as queries } from './queries.ts';
export { defineStyles as css } from './styles.ts';
export type { Trait } from './traits.ts';
export { defineTrait as trait } from './traits.ts';
export type { Styles as CSS } from './types/css.ts';
export type { VariantsFor } from './types/elements.ts';
export type {
  NestedStyles,
  StyleFragment,
  StyleFragmentBuilder
} from './types/fragments.ts';
