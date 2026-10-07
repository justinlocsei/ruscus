import { mergeStyles } from './styles.ts';
import type { ElementSpec, Styles } from './types.ts';

export class Element<S extends ElementSpec> {
  styles: Styles;

  /**
   * Create an element
   */
  constructor() {
    this.styles = {};
  }

  /**
   * Apply styles to the element
   */
  css(styles: Styles): Element<S> {
    this.styles = mergeStyles(this.styles, styles);
    return this;
  }
}
