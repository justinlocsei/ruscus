import { mergeStyles } from './styles.ts';
import type { Thunkable } from './types/utils.ts';
import type {
  AnyElementSpec,
  ElementSpec,
  NestedContext,
  NestedProvider,
  PatchElementSpec,
  Styles,
  VariantStyles
} from './types.ts';
import { resolve } from './utils.ts';
import { resolveVariants } from './variants.ts';

/**
 * An eager or lazy element definition
 */
export type ElementProvider = Thunkable<Element>;

/**
 * A mapping of element names to providers
 */
export type ElementProviders = Record<string, ElementProvider>;

/**
 * A mapping of element names to elements
 */
export type NamedElements = Record<string, Element>;

/**
 * Infer an element spec from a provider
 */
export type SpecFromProvider<P extends ElementProvider> = P extends
  () => Element<infer S> ? S : P extends Element<infer S> ? S : never;

/**
 * Convert element providers to a tree of specs
 */
export type ProvidersToSpecs<T extends ElementProviders> = {
  [P in keyof T]: SpecFromProvider<T[P]>;
};

/**
 * Create an element
 */
export function createElement(
  styles: Styles = {}
): Element {
  return new Element().css(styles);
}

/**
 * Resolve element providers to a tree of elements
 */
export function resolveElements(
  providers: ElementProviders
): NamedElements {
  const els: NamedElements = {};

  for (const [name, provider] of Object.entries(providers)) {
    els[name] = resolve(provider);
  }

  return els;
}

/**
 * The current state of an element
 */
type ElementState = {
  children: NamedElements;
  nested: NestedProvider;
  styles: Styles;
  variants: Record<string, Styles>;
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
  V extends VariantStyles
> = Element<
  PatchElementSpec<S, { variants: Extract<keyof V, string> }>
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
      nested: {},
      styles: {},
      variants: {}
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
   * Define nested styles for the element
   */
  nested(
    definitions: NestedProvider<
      NestedContext<S['children'], S['variants']>
    >
  ): Element<S> {
    this.updateState('nested', definitions);

    return this;
  }

  /**
   * Define variants for the element
   */
  variants<T extends VariantStyles>(
    provider: Thunkable<T>
  ): WithVariants<S, T> {
    this.updateState('variants', resolveVariants(provider));

    return this as WithVariants<S, T>;
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
    if (Object.keys(this.current[field]).length) {
      throw new Error(`${field} may only be set once`);
    }

    this.current[field] = value;
  }
}
