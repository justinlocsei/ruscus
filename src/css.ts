import type { Component } from './components.ts';
import type { Element } from './elements.ts';
import { asProperty } from './properties.ts';
import type { Styles } from './types.ts';

/**
 * Options for compiling a component's CSS
 */
export type CompileConfig = {
  indentation?: number;
};

/**
 * Generate CSS for a component's styles
 */
export function styleComponent(
  component: Component,
  config: CompileConfig = {}
): string {
  return new ComponentCompiler(component, config).compile();
}

class ComponentCompiler {
  private blocks: string[];
  private component: Component;
  private config: Required<CompileConfig>;

  /**
   * Create a compiler for a component's styles
   */
  constructor(component: Component, config: CompileConfig) {
    this.blocks = [];

    this.component = component;
    this.config = { indentation: 2, ...config };
  }

  /**
   * Produce CSS for the component's styles
   */
  compile(): string {
    const { current } = this.component;

    this.addRule(
      `.${this.component.id}`,
      current.styles
    );

    for (
      const [name, element] of Object.entries(current.elements)
    ) {
      this.addElementRules([name], element);
    }

    return this.blocks.join('\n\n');
  }

  /**
   * Add rules for a component's elements
   */
  private addElementRules(path: string[], element: Element): void {
    const { current } = element;
    const selector = `.${[this.component.id, ...path].join('__')}`;

    this.addRule(selector, current.styles);

    for (const [name, styles] of Object.entries(current.variants)) {
      this.addRule(`${selector}.is-${name}`, styles);
    }

    for (const [name, child] of Object.entries(current.children)) {
      this.addElementRules([...path, name], child);
    }
  }

  /**
   * Add a CSS rule
   */
  private addRule(selector: string, styles: Styles): void {
    const rule = this.formatRule(selector, styles);

    if (rule) {
      this.blocks.push(rule);
    }
  }

  /**
   * Format a CSS rule
   */
  private formatRule(
    selector: string,
    styles: Styles
  ): string | undefined {
    const properties = Object
      .entries(styles)
      .filter(([, v]) => v !== undefined)
      .map(([k]) => k);

    if (properties.length === 0) {
      return undefined;
    }

    const indent = ' '.repeat(this.config.indentation);

    const declarations = properties
      .map(p => `${indent}${asProperty(p)}: ${styles[p]};`)
      .join('\n');

    return `${selector} {\n${declarations}\n}`;
  }
}
