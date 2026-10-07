import { mergeStyles } from './styles.ts';
import type { ComponentSpec, Styles } from './types.ts';

type ComponentOptions = {
  namespace?: string;
}

export class Component<S extends ComponentSpec> {
  id: string;
  styles: Styles;

  private name: string;
  private options: ComponentOptions;

  /**
   * Create a component
   */
  constructor(name: string, options: ComponentOptions = {}) {
    this.name = name;
    this.options = options;
    this.styles = {};

    this.id = [this.options.namespace, this.name]
      .filter(Boolean)
      .join('--');
  }

  /**
   * Apply styles to the component
   */
  css(styles: Styles): Component<S> {
    this.styles = mergeStyles(this.styles, styles);
    return this;
  }
}
