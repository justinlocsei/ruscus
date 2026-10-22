import type { ComponentDefinition } from '../types/components.ts';

export abstract class Naming {
  protected component: ComponentDefinition;

  /**
   * Create a naming strategy for a component
   */
  constructor(component: ComponentDefinition) {
    this.component = component;
  }

  /**
   * Produce a class name from a list of levels
   */
  abstract forClass(levels: string[]): string;

  /**
   * Produce the class name for a variant
   */
  forVariant(name: string): string {
    return `is-${name}`;
  }
}
