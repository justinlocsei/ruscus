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
import type { HasVariants, Patch } from './utils.ts';

/**
 * The most inclusive form of a component spec
 */
export type AnyComponentSpec = ComponentSpec<
  ElementSpecs,
  string,
  string
>;

/**
 * The most inclusive form of a derived context
 */
export type AnyDerivedContext = DerivedContext<
  ElementSpecs,
  string,
  string
>;

/**
 * The most inclusive form of a variants context
 */
export type AnyVariantsContext = VariantsContext<ElementSpecs, string>;

/**
 * The data that fully defines a component
 */
export type ComponentDefinition = {
  elements: ElementDefinitions;
  global: GlobalProvider<AnyDerivedContext>[];
  id: string;
  identifiers: NamedIdentifiers;
  nested: NestedProvider<AnyDerivedContext>[];
  styles: Styles;
  variants?: VariantsProvider<AnyVariantsContext>;
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
 * Elements available in a context
 */
export type ContextElements<E extends ElementSpecs> = {
  els: Selectors<E>;
};

/**
 * Identifiers available in a context
 */
export type ContextIdentifiers<I extends string> = {
  ids: IdentifierValues<I>;
};

/**
 * Variants available in a context
 */
export type ContextVariants<V extends string> = {
  variants: VariantSelector<V>;
};

/**
 * The context available when defining derived styles
 */
export type DerivedContext<
  E extends NamedElements<E> = EmptyElementSpecs,
  V extends string = never,
  I extends string = never
> = ContextElements<E> & ContextIdentifiers<I> & ContextVariants<V>;

/**
 * The context available when defining elements
 */
export type ElementsContext<I extends string = never> = ContextIdentifiers<I>;

/**
 * An empty component spec
 */
export type EmptyComponentSpec = ComponentSpec<
  EmptyElementSpecs,
  never,
  never
>;

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
  S['ids']
>;

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
> = ContextElements<E> & ContextIdentifiers<I>;

/**
 * A provider of variant styles
 */
export type VariantsProvider<C extends VariantsContext = VariantsContext> =
  DerivedFragmentProvider<C, 'relative'>;
