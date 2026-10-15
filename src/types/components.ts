import type { Styles } from './css.ts';
import type {
  ElementDefinitions,
  ElementSpecs,
  EmptyElementSpecs,
  NamedElements,
  Selectors,
  VariantSelector
} from './elements.ts';
import type { DerivedFragmentProvider } from './fragments.ts';
import type { EmptyObject, HasVariants, Patch } from './utils.ts';

/**
 * The most inclusive form of a component spec
 */
export type AnyComponentSpec = ComponentSpec<
  ElementSpecs,
  string,
  NamedIdentifiers
>;

/**
 * The data that fully defines a component
 */
export type ComponentDefinition = {
  elements: ElementDefinitions;
  global: GlobalProvider[];
  identifiers: NamedIdentifiers;
  nested: NestedProvider[];
  styles: Styles;
  variants?: VariantsProvider;
};

/**
 * A specification for a component
 */
export type ComponentSpec<
  E extends ElementSpecs,
  V extends string,
  I extends NamedIdentifiers
> = HasVariants<V> & {
  els: E;
  ids: I;
};

/**
 * The context available when defining derived styles
 */
export type DerivedContext<
  E extends NamedElements<E> = EmptyElementSpecs,
  V extends string = never,
  I extends string = never
> = {
  els: Selectors<E>;
  ids: IdentifierValues<I>;
  variants: VariantSelector<V>;
};

/**
 * An empty component spec
 */
export type EmptyComponentSpec = ComponentSpec<
  EmptyElementSpecs,
  never,
  EmptyIdentifierTypes
>;

/**
 * An empty set of identifier types
 */
export type EmptyIdentifierTypes = EmptyObject;

/**
 * A provider of global styles
 */
export type GlobalProvider<C extends DerivedContext = DerivedContext> =
  DerivedFragmentProvider<C, 'absolute'>;

/**
 * A provider of nested styles
 */
export type NestedProvider<C extends DerivedContext = DerivedContext> =
  DerivedFragmentProvider<C, 'relative'>;

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
  keyof S['ids'] & string
>;

/**
 * A context that exposes a component's identifiers
 */
export type IdentifiersContext<I extends NamedIdentifiers = NamedIdentifiers> =
  { ids: IdentifierValues<keyof I & string> };

/**
 * A mapping of identifier names to their types
 */
export type NamedIdentifiers = Record<string, IdentifierType>;

/**
 * Replace selected fields in a component spec
 */
export type PatchComponentSpec<
  S extends AnyComponentSpec,
  U extends Partial<AnyComponentSpec>
> = Patch<AnyComponentSpec, S, U>;

/**
 * The context available to variant definitions
 */
export type VariantsContext<
  E extends NamedElements<E> = EmptyElementSpecs,
  I extends string = never
> = {
  els: Selectors<E>;
  ids: IdentifierValues<I>;
};

/**
 * A provider of variant styles
 */
export type VariantsProvider<C extends VariantsContext = VariantsContext> =
  DerivedFragmentProvider<C, 'relative'>;
