import type { Styles } from './css.ts';
import type { DerivedStyles } from './fragments.ts';
import { ELEMENT_ROOT } from './ids.ts';
import type { EmptyObject, HasVariants } from './utils.ts';

/**
 * The context available when defining derived element styles
 */
export type DerivedElementContext<
  S extends ElementSpec = ElementSpec
> = {
  els: ProjectTree<S, S['children']>;
  variants: VariantProjector<S['variants']>;
};

/**
 * A provider of styles derived from an element context
 */
export type DerivedElementStyles<
  C extends object = DerivedElementContext
> = DerivedStyles<'relative', C>;

/**
 * The data that fully defines an element
 */
export type ElementDefinition = {
  children: ElementDefinitions;
  nested: DerivedElementStyles[];
  styles: Styles;
  variants?: DerivedElementStyles;
};

/**
 * A mapping of element names to definitions
 */
export type ElementDefinitions = Record<string, ElementDefinition>;

/**
 * A specification for an element
 */
export type ElementSpec<
  C extends ElementSpecs = ElementSpecs,
  V extends string = string
> = HasVariants<V> & {
  children: C;
};

/**
 * A nested collection of named element specs
 */
export type ElementSpecs = { [K in string]: ElementSpec };

/**
 * An empty element spec
 */
export type EmptyElementSpec = ElementSpec<EmptyElementSpecs, never>;

/**
 * An empty set of element specs
 */
export type EmptyElementSpecs = EmptyObject;

/**
 * A constraint on element specs that preserves each element's type
 */
type NamedElements<E extends object> = { [K in keyof E]: ElementSpec };

/**
 * Project a root or branch element
 */
type ProjectElement<S extends ElementSpec> = [
  keyof S['children']
] extends [never] ? ProjectRoot<S>
  : S['children'] extends NamedElements<S['children']>
    ? ProjectTree<S, S['children']>
  : never;

/**
 * Project a tree of elements as class names
 */
type ProjectElements<E extends NamedElements<E>> = {
  [K in keyof E]: ProjectElement<E[K]>;
};

/**
 * Project an element root as a static or dynamic value based on its variants
 */
type ProjectRoot<S extends HasVariants<string>> = [
  S['variants']
] extends [never] ? string : VariantProjector<S['variants']>;

/**
 * Project an element tree and its possible children as class names
 */
export type ProjectTree<
  Root extends HasVariants<string>,
  Children extends NamedElements<Children>
> = { [ELEMENT_ROOT]: ProjectRoot<Root> } & ProjectElements<Children>;

/**
 * A projector for a selector that uses one or more variants
 */
export type VariantProjector<V extends string> = <T extends V>(
  ...names: T[]
) => string;

/**
 * Extract variant names from a provider
 */
export type VariantsFromProvider<P> = P extends DerivedStyles
  ? keyof ReturnType<P>
  : never;
