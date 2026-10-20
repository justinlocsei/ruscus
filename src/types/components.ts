import type { Styles } from './css.ts';
import type {
  ElementDefinitions,
  ElementSpecs,
  EmptyElementSpecs,
  ProjectedTree,
  VariantProjector
} from './elements.ts';
import type { DerivedStyles, FragmentScope } from './fragments.ts';
import type { HasVariants } from './utils.ts';

/**
 * The context available when defining derived component styles
 */
export type DerivedComponentContext<
  S extends ComponentSpec = ComponentSpec
> = {
  els: ProjectedTree<S, S['els']>;
  ids: IdentifierValues<S['ids']>;
  variants: VariantProjector<S['variants']>;
};

/**
 * A provider of styles derived from a component context
 */
export type DerivedComponentStyles<
  S extends FragmentScope = FragmentScope,
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
  E extends ElementSpecs = ElementSpecs,
  V extends string = string,
  I extends string = string
> = HasVariants<V> & {
  els: E;
  ids: I;
};

/**
 * A component projected as class names
 */
export type ProjectedComponent<S extends ComponentSpec> = ProjectedTree<
  S,
  S['els']
>;

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
export type IdentifierValuesFor<S extends ComponentSpec> = IdentifierValues<
  S['ids']
>;

/**
 * A mapping of identifier names to their types
 */
export type NamedIdentifiers = Record<string, IdentifierType>;
