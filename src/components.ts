import type {
  ElementProviders,
  NamedElements,
  ProvidersToSpecs
} from './elements.ts';
import { createElement, resolveElements } from './elements.ts';
import { buildIdentifiersContext } from './identifiers.ts';
import { mergeStyles } from './styles.ts';
import type {
  AnyComponentSpec,
  ComponentSpec,
  GlobalProvider,
  IdentifiersContext,
  IdentifierTypes,
  NestedContext,
  NestedProvider,
  PatchComponentSpec,
  Styles,
  VariantProvider,
  VariantsFromProvider
} from './types.ts';

/**
 * Options for creating a component
 */
type ComponentOptions = {
  namespace?: string;
};

/**
 * Define a global provider for a component spec
 */
type StyleContextFor<S extends AnyComponentSpec> =
  & NestedContext<S['els'], S['variants']>
  & IdentifiersContext<S['ids']>;

/**
 * Define a global provider for a component spec
 */
type GlobalProviderFor<S extends AnyComponentSpec> = GlobalProvider<
  StyleContextFor<S>
>;

/**
 * Define a nested provider for a component spec
 */
type NestedProviderFor<S extends AnyComponentSpec> = NestedProvider<
  StyleContextFor<S>
>;

/**
 * Define a variant provider for a component spec
 */
type VariantProviderFor<S extends AnyComponentSpec> = VariantProvider<
  StyleContextFor<S>
>;

/**
 * The current state of a component
 */
type ComponentState<S extends AnyComponentSpec = AnyComponentSpec> = {
  elements: NamedElements;
  global: GlobalProvider[];
  identifiers: IdentifierTypes;
  nested: NestedProvider[];
  styles: Styles;
  variants?: VariantProviderFor<S>;
};

/**
 * Apply element constraints to a component
 */
type WithElements<
  S extends AnyComponentSpec,
  T extends ElementProviders
> = Component<
  PatchComponentSpec<S, { els: ProvidersToSpecs<T> }>
>;

/**
 * Apply identifier constraints to a component
 */
type WithIdentifiers<
  S extends AnyComponentSpec,
  I extends IdentifierTypes
> = Component<
  PatchComponentSpec<S, { ids: I }>
>;

/**
 * Apply variant constraints to a component
 */
type WithVariants<
  S extends AnyComponentSpec,
  P extends VariantProvider<StyleContextFor<S>>
> = Component<
  PatchComponentSpec<S, { variants: VariantsFromProvider<P> }>
>;

export class Component<
  S extends AnyComponentSpec = ComponentSpec
> {
  current: ComponentState<S>;
  id: string;

  private name: string;
  private options: ComponentOptions;

  /**
   * Create a component
   */
  constructor(name: string, options: ComponentOptions = {}) {
    this.name = name;
    this.options = options;

    this.current = {
      elements: {},
      global: [],
      identifiers: {},
      nested: [],
      styles: {}
    };

    this.id = [this.options.namespace, this.name]
      .filter(Boolean)
      .join('--');
  }

  /**
   * Apply styles to the component root
   */
  css(styles: Styles): Component<S> {
    const { current } = this;
    current.styles = mergeStyles(current.styles, styles);

    return this;
  }

  /**
   * Define component-specific identifiers
   */
  identifiers<I extends IdentifierTypes>(types: I): WithIdentifiers<S, I> {
    this.updateState('identifiers', types);

    return this as WithIdentifiers<S, I>;
  }

  /**
   * Define the component's elements
   */
  elements<T extends ElementProviders>(
    provider: (
      e: typeof createElement,
      ctx: IdentifiersContext<S['ids']>
    ) => T
  ): WithElements<S, T> {
    this.current.elements = resolveElements(
      provider(
        createElement,
        buildIdentifiersContext(this.id, this.current.identifiers)
      )
    );

    return this as WithElements<S, T>;
  }

  /**
   * Define global styles for the component
   */
  global(definitions: GlobalProviderFor<S>): Component<S> {
    this.current.global.push(
      definitions as GlobalProvider
    );

    return this;
  }

  /**
   * Define nested styles for the component
   */
  nested(definitions: NestedProviderFor<S>): Component<S> {
    this.current.nested.push(
      definitions as NestedProvider
    );

    return this;
  }

  /**
   * Define variants for the component root
   */
  variants<P extends VariantProviderFor<S>>(
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
  private updateState<T extends keyof ComponentState<S>>(
    field: T,
    value: ComponentState<S>[T]
  ): void {
    const current = this.current[field];

    if (field === 'variants') {
      if (current !== undefined) {
        throw new Error(`${field} may only be called once`);
      }
    } else if (Object.keys(current as object).length) {
      throw new Error(`${field} may only be called once`);
    }

    this.current[field] = value;
  }
}
