import type { RelativeFragmentFactory } from './fragments.ts';
import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { applyTrait } from './traits.ts';
import type { Thunkable } from './types/utils.ts';
import type {
  AnyElementSpec,
  ElementSpec,
  NestedContext,
  NestedDefinitions,
  PatchElementSpec,
  Styles,
  VariantProvider,
  VariantsFromProvider
} from './types.ts';
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
type ElementVariantContext<S extends AnyElementSpec> = NestedContext<
  S['children'],
  never
>;

type ElementNestedProvider = (
  s: RelativeFragmentFactory,
  ctx: NestedContext
) => NestedDefinitions;

type ElementState = {
  children: NamedElements;
  nested: ElementNestedProvider[];
  styles: Styles;
  variants?: (
    s: RelativeFragmentFactory,
    ctx: NestedContext
  ) => NestedDefinitions;
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
  P extends VariantProvider<ElementVariantContext<S>>
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
   * Apply reusable trait styles and nested rules
   */
  is(...traits: Trait[]): Element<S> {
    for (const trait of traits) {
      applyTrait(this.current, trait);
    }

    return this;
  }

  /**
   * Define nested styles for the element
   */
  nested(
    definitions: (
      s: RelativeFragmentFactory,
      ctx: NestedContext<S['children'], S['variants']>
    ) => NestedDefinitions
  ): Element<S> {
    this.current.nested.push(definitions);

    return this;
  }

  /**
   * Define variants for the element
   */
  variants<P extends VariantProvider<ElementVariantContext<S>>>(
    provider: P
  ): WithVariants<S, P> {
    this.updateState('variants', provider);

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
      isSet = field === 'variants' || Object.keys(current).length > 0;
    } else {
      isSet = false;
    }

    if (isSet) {
      throw new Error(`${field} may only be set once`);
    }

    this.current[field] = value;
  }
}
