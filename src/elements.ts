import type { BuilderState } from './builder.ts';
import Builder from './builder.ts';
import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { mergeTraits } from './traits.ts';
import type { Styles } from './types/css.ts';
import type {
  DerivedElementContext,
  DerivedElementStyles,
  ElementDefinition,
  ElementDefinitions,
  ElementSpec,
  EmptyElementSpec,
  VariantsFromProvider
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
type ElementProvider = Thunkable<AnyElement>;

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

export class Element<S extends ElementSpec = ElementSpec>
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
  ): Element<ElementSpec<ProvidersToSpecs<T>, S['variants']>> {
    this.setStateField(
      'children',
      resolveElements(resolve(definitions))
    );

    // biome-ignore lint/suspicious/noExplicitAny: avoid a duplicate signature in a cast
    return this as any;
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
    provider: DerivedElementStyles<DerivedElementContext<S>>
  ): Element<S> {
    this.current.nested.push(
      provider as DerivedElementStyles
    );

    return this;
  }

  /**
   * Define variants for the element
   */
  variants<
    P extends DerivedElementStyles<Pick<DerivedElementContext<S>, 'els'>>
  >(
    provider: P
  ): Element<ElementSpec<S['children'], VariantsFromProvider<P>>> {
    this.setStateField(
      'variants',
      provider as DerivedElementStyles
    );

    return this;
  }
}
