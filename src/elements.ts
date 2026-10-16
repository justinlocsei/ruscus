import type { BuilderState } from './builder.ts';
import Builder from './builder.ts';
import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { mergeTraits } from './traits.ts';
import type { Styles } from './types/css.ts';
import type {
  AnyElementSpec,
  ElementDefinition,
  ElementDefinitions,
  EmptyElementSpec,
  NestedContext,
  NestedProvider,
  PatchElementSpec,
  VariantsContext,
  VariantsFromProvider,
  VariantsProvider
} from './types/elements.ts';
import type { Thunkable } from './types/utils.ts';
import { resolve } from './utils.ts';

/**
 * A wide, data-only form of an element class
 */
type AnyElement = BuilderState<ElementDefinition>;

/**
 * An eager or lazy element definition
 */
export type ElementProvider = Thunkable<AnyElement>;

/**
 * A mapping of element names to providers
 */
export type ElementProviders = Record<string, ElementProvider>;

/**
 * A mapping of names to elements
 */
export type NamedElements = Record<string, AnyElement>;

/**
 * Infer an element spec from a provider
 */
type SpecFromProvider<P extends ElementProvider> = P extends
  () => Element<infer S> ? S : P extends Element<infer S> ? S : never;

/**
 * Convert element providers to a tree of specs
 */
export type ProvidersToSpecs<T extends ElementProviders> = {
  [P in keyof T]: SpecFromProvider<T[P]>;
};

/**
 * Define an element
 */
export function defineElement(
  styles: Styles = {}
): Element<EmptyElementSpec> {
  return new Element().css(styles);
}

/**
 * A factory for defining elements
 */
export type ElementFactory = typeof defineElement;

/**
 * Resolve element providers to concrete elements
 */
export function resolveElements(
  providers: ElementProviders
): ElementDefinitions {
  return Object.entries(providers).reduce<ElementDefinitions>(
    (els, [name, provider]) => {
      els[name] = resolve(provider).current;
      return els;
    },
    {}
  );
}

/**
 * Apply child constraints to an element
 */
type WithChildren<
  S extends AnyElementSpec,
  T extends ElementProviders
> = Element<
  PatchElementSpec<S, { children: ProvidersToSpecs<T> }>
>;

/**
 * Apply variant constraints to an element
 */
type WithVariants<
  S extends AnyElementSpec,
  P extends VariantsProvider
> = Element<
  PatchElementSpec<S, { variants: VariantsFromProvider<P> }>
>;

export class Element<S extends AnyElementSpec>
  extends Builder<ElementDefinition>
{
  /**
   * Create an element
   */
  constructor() {
    super({
      children: {},
      nested: [],
      styles: {}
    });
  }

  /**
   * Define child elements
   */
  children<T extends ElementProviders>(
    definitions: Thunkable<T>
  ): WithChildren<S, T> {
    this.setStateField(
      'children',
      resolveElements(resolve(definitions))
    );

    return this as WithChildren<S, T>;
  }

  /**
   * Apply styles to the element
   */
  css(styles: Styles): Element<S> {
    const { current } = this;
    current.styles = mergeStyles(current.styles, styles);

    return this;
  }

  /**
   * Apply traits to the element
   */
  is(...traits: Trait[]): Element<S> {
    const { nested, root } = mergeTraits(...traits);

    this.current.styles = mergeStyles(this.current.styles, root);

    if (Object.keys(nested).length > 0) {
      this.current.nested.push(() => nested);
    }

    return this;
  }

  /**
   * Define nested styles for the element
   */
  nested(
    provider: NestedProvider<
      NestedContext<S['children'], S['variants']>
    >
  ): Element<S> {
    this.current.nested.push(provider as NestedProvider);

    return this;
  }

  /**
   * Define variants for the element
   */
  variants<P extends VariantsProvider<VariantsContext<S['children']>>>(
    provider: P
  ): WithVariants<S, P> {
    this.setStateField(
      'variants',
      provider as VariantsProvider
    );

    return this as WithVariants<S, P>;
  }
}
