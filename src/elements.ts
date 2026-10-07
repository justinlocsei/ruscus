import { mergeStyles } from './styles.ts';
import type { ElementSpec, NamedElements, PatchSpec, Styles } from './types.ts';

/**
 * An eager or lazy element definition
 */
export type ElementProvider =
  | Element
  | (() => Element);

/**
 * A mapping of element names to providers
 */
export type ElementProviders = Record<string, ElementProvider>;

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
): Record<string, Element> {
  const els: Record<string, Element> = {};

  for (const [name, provider] of Object.entries(providers)) {
    els[name] = typeof provider === 'function' ? provider() : provider;
  }

  return els;
}

/**
 * The current state of an element
 */
type ElementState = {
  children: Record<string, Element>;
  styles: Styles;
};

/**
 * Apply child constraints to an element
 */
type WithChildren<
  S extends ElementSpec<NamedElements>,
  T extends ElementProviders
> = Element<
  PatchSpec<S, { children: ProvidersToSpecs<T> }>
>;

export class Element<
  S extends ElementSpec<NamedElements> = ElementSpec
> {
  current: ElementState;

  /**
   * Create an element
   */
  constructor() {
    this.current = {
      children: {},
      styles: {}
    };
  }

  /**
   * Define child elements
   */
  children<T extends ElementProviders>(
    provider: (e: typeof createElement) => T
  ): WithChildren<S, T> {
    this.current.children = resolveElements(provider(createElement));

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
}
