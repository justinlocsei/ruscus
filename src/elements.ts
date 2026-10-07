import { mergeStyles } from './styles.ts';
import type { ElementSpec, Styles } from './types.ts';

export class Element<S extends ElementSpec> {
/**
 * The current state of an element
 */
type ElementState = {
  children: Record<string, Element>;
  styles: Styles;
};

export class Element<S extends ElementSpec = ElementSpec> {
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
   * Apply styles to the element
   */
  css(styles: Styles): Element<S> {
    const { current } = this;
    current.styles = mergeStyles(current.styles, styles);

    return this;
  }
}
