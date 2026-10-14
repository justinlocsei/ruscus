import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { applyTraits } from './traits.ts';
import type { Styles } from './types/css.ts';
import type {
  AnyElementSpec,
  ElementSpec,
  NestedContext,
  NestedDefinitions,
  PatchElementSpec,
  VariantProvider,
  VariantsFromProvider
} from './types/elements.ts';
import type { RelativeFragmentFactory } from './types/fragments.ts';
import type { Thunkable } from './types/utils.ts';
import { resolve } from './utils.ts';

/**
 * An eager or lazy element definition
 */
export type ElementProvider = Thunkable<Element>;

/**
 * A mapping of element names to providers
 */
export type ElementProviders = Record<string, ElementProvider>;

/**
 * A mapping of names to elements
 */
export type NamedElements = Record<string, Element>;

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
): Element {
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
): NamedElements {
  return Object.entries(providers).reduce<NamedElements>(
    (els, [name, provider]) => {
      els[name] = resolve(provider);
      return els;
    },
    {}
  );
}

/**
 * The context available when defining variants
 */
type VariantContext<S extends AnyElementSpec> = NestedContext<
  S['children'],
  never
>;

/**
 * A provider for nested element definitions
 */
type NestedElementProvider<C extends NestedContext = NestedContext> = (
  s: RelativeFragmentFactory,
  ctx: C
) => NestedDefinitions;

/**
 * The current state of an element
 */
type ElementState = {
  children: NamedElements;
  nested: NestedElementProvider[];
  styles: Styles;
  variants?: VariantProvider<NestedContext>;
};

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
  P extends VariantProvider<VariantContext<S>>
> = Element<
  PatchElementSpec<S, { variants: VariantsFromProvider<P> }>
>;

export class Element<
  S extends AnyElementSpec = ElementSpec
> {
  current: ElementState;

  /**
   * Create an element
   */
  constructor() {
    this.current = {
      children: {},
      nested: [],
      styles: {}
    };
  }

  /**
   * Define child elements
   */
  children<T extends ElementProviders>(
    definitions: Thunkable<T>
  ): WithChildren<S, T> {
    this.updateState(
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
    applyTraits(this.current, traits);

    return this;
  }

  /**
   * Define nested styles for the element
   */
  nested(
    provider: NestedElementProvider<
      NestedContext<S['children'], S['variants']>
    >
  ): Element<S> {
    this.current.nested.push(provider);

    return this;
  }

  /**
   * Define variants for the element
   */
  variants<P extends VariantProvider<VariantContext<S>>>(
    provider: P
  ): WithVariants<S, P> {
    this.updateState(
      'variants',
      provider as VariantProvider<NestedContext>
    );

    return this as WithVariants<S, P>;
  }

  /**
   * Update a field in the current state
   *
   * @throws if the field already has a value
   */
  private updateState<T extends keyof ElementState>(
    field: T,
    value: ElementState[T]
  ): void {
    const current = this.current[field];

    let isSet: boolean;

    if (current !== undefined) {
      isSet = typeof current !== 'object' || Object.keys(current).length > 0;
    } else {
      isSet = false;
    }

    if (isSet) {
      throw new Error(`${field} may only be called once`);
    }

    this.current[field] = value;
  }
}
