import type { Styles } from './css.ts';
import type {
  ElementDefinitions,
  ElementSpecs,
  EmptyElementSpecs,
  Selectors,
  VariantProjector
} from './elements.ts';
import type { DerivedStyles, Scope } from './fragments.ts';
import type { HasVariants } from './utils.ts';

/**
 * The most inclusive form of a component spec
 */
export type AnyComponentSpec = ComponentSpec<
  ElementSpecs,
  string,
  string
>;

/**
 * The context available when defining derived component styles
 */
export type DerivedComponentContext<
  S extends AnyComponentSpec = AnyComponentSpec
> = {
  els: Selectors<S['els']>;
  ids: IdentifierValues<S['ids']>;
  variants: VariantProjector<S['variants']>;
};

/**
 * A provider of styles derived from a component context
 */
export type DerivedComponentStyles<
  S extends Scope = Scope,
  C extends object = DerivedComponentContext
> = DerivedStyles<S, C>;

/**
 * The data that fully defines a component
 */
export type ComponentDefinition = {
  elements: ElementDefinitions;
  global: DerivedComponentStyles<'absolute'>[];
  id: string;
  identifiers: NamedIdentifiers;
  nested: DerivedComponentStyles[];
  styles: Styles;
  variants?: DerivedComponentStyles;
};

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends ElementSpecs,
  V extends string,
  I extends string
> = HasVariants<V> & {
  els: E;
  ids: I;
};

/**
 * An empty component spec
 */
export type EmptyComponentSpec = ComponentSpec<
  EmptyElementSpecs,
  never,
  never
>;

/**
 * A type of a component-specific identifier
 */
type IdentifierType = 'string' | 'variable';

/**
 * Values for component identifirs
 */
export type IdentifierValues<T extends string = string> = Record<T, string>;

/**
 * Get the identifier values for a component spec
 */
export type IdentifierValuesFor<S extends AnyComponentSpec> = IdentifierValues<
  S['ids']
>;

/**
 * A mapping of identifier names to their types
 */
export type NamedIdentifiers = Record<string, IdentifierType>;
