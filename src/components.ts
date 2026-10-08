import type {
  Element,
  ElementProviders,
  ProvidersToSpecs
} from './elements.ts';
import { createElement, resolveElements } from './elements.ts';
import { mergeStyles } from './styles.ts';
import type {
  AnyComponentSpec,
  ComponentSpec,
  PatchComponentSpec,
  Styles,
  VariantStyles
} from './types.ts';

/**
 * Options for creating a component
 */
type ComponentOptions = {
  namespace?: string;
};

/**
 * The current state of a component
 */
type ComponentState = {
  elements: Record<string, Element>;
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
  current: ComponentState;
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
   * Define the component's elements
   */
  elements<T extends ElementProviders>(
    provider: (e: typeof createElement) => T
  ): WithElements<S, T> {
    this.current.elements = resolveElements(provider(createElement));

    return this as WithElements<S, T>;
  }

  /**
   * Define variants for the component root
   */
  variants<T extends VariantStyles>(styles: T): WithVariants<S, T> {
    this.updateState('variants', styles);

    return this as WithVariants<S, T>;
  }

  /**
   * Update a field in the current state
   *
   * @throws if the field already has a value
   */
  private updateState<T extends keyof ComponentState>(
    field: T,
    value: ComponentState[T]
  ): void {
    if (Object.keys(this.current[field]).length) {
      throw new Error(`${field} may only be set once`);
    }

    this.current[field] = value;
  }
}
