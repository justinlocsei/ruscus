import type { ComponentDefinition } from '../types/components.ts';

export abstract class Naming {
  protected component: ComponentDefinition;
  protected prefix: string;

  /**
   * Create a naming strategy for a component
   */
  constructor(
    component: ComponentDefinition,
    prefix = ''
  ) {
    this.component = component;
    this.prefix = prefix;
  }

  /**
   * Produce a class name from a list of levels
   */
  abstract forClass(levels: string[]): string;

  /**
   * Produce the class name for a variant
   */
  forVariant(name: string): string {
    return this.project(`is-${name}`);
  }

  /**
   * Project a class name
   */
  protected project(className: string): string {
    return `${this.prefix}${className}`;
  }
}
