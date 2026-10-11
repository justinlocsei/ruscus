import type {
  ElementProviders,
  NamedElements,
  ProvidersToSpecs
} from './elements.ts';
import { createElement, resolveElements } from './elements.ts';
import { buildIdentifiersContext } from './identifiers.ts';
import { mergeStyles } from './styles.ts';
import type { Thunkable } from './types/utils.ts';
import type {
  AnyComponentSpec,
  ComponentSpec,
  IdentifiersContext,
  IdentifierTypes,
  NestedContext,
  NestedProvider,
  PatchComponentSpec,
  Styles,
  VariantStyles
} from './types.ts';
import { resolveVariants } from './variants.ts';

/**
 * Options for creating a component
 */
type ComponentOptions = {
  namespace?: string;
};

/**
 * Define a nested provider for a component spec
 */
type NestedProviderFor<S extends AnyComponentSpec> = NestedProvider<
  NestedContext<S['els'], S['variants']> & IdentifiersContext<S['ids']>
>;

/**
 * The current state of a component
 */
type ComponentState<S extends AnyComponentSpec> = {
  elements: NamedElements;
  identifiers: IdentifierTypes;
  nested: NestedProviderFor<S>;
  styles: Styles;
  variants: Record<string, Styles>;
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
  V extends VariantStyles
> = Component<
  PatchComponentSpec<S, { variants: Extract<keyof V, string> }>
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
      identifiers: {},
      nested: {},
      styles: {},
      variants: {}
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
   * Define nested styles for the component
   */
  nested(definitions: NestedProviderFor<S>): Component<S> {
    this.updateState('nested', definitions);

    return this;
  }

  /**
   * Define variants for the component root
   */
  variants<T extends VariantStyles>(
    definitions: Thunkable<T>
  ): WithVariants<S, T> {
    this.updateState('variants', resolveVariants(definitions));

    return this as WithVariants<S, T>;
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
    if (Object.keys(this.current[field]).length) {
      throw new Error(`${field} may only be called once`);
    }

    this.current[field] = value;
  }
}
