import type {
  ElementSpecs,
  EmptyElementSpecs,
  NestedContext
} from './elements.ts';
import type { AbsoluteFragmentFactory, ScopedFragments } from './fragments.ts';
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
 * Global rule definitions keyed by selector or query prelude
 */
export type GlobalDefinitions = ScopedFragments<'absolute'>;

/**
 * A provider of global styles
 */
export type GlobalProvider<C extends NestedContext = NestedContext> = (
  s: AbsoluteFragmentFactory,
  ctx: C
) => GlobalDefinitions;

/**
 * A type of a component-specific identifier
 */
type IdentifierType = 'string' | 'variable';

/**
 * A context that exposes a component's identifiers
 */
export type IdentifiersContext<I extends NamedIdentifiers = NamedIdentifiers> =
  { ids: { [K in keyof I]: string } };

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
