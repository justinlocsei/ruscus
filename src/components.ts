import type {
  Element,
  ElementProviders,
  ElementProvidersToSpecs
} from './elements.ts';
import { createElement, resolveElements } from './elements.ts';
import { mergeStyles } from './styles.ts';
import type { ComponentSpec, NamedElements, Styles } from './types.ts';

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
};

export class Component<
  S extends ComponentSpec<NamedElements> = ComponentSpec
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
   * Define the component's elements
   */
  elements<T extends ElementProviders>(
    provider: (e: typeof createElement) => T
  ): Component<ComponentSpec<ElementProvidersToSpecs<T>>> {
    this.current.elements = resolveElements(provider(createElement));

    return this as Component<
      ComponentSpec<ElementProvidersToSpecs<T>>
    >;
  }
}
