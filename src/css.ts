import {
  buildNestedContext,
  isStyles,
  resolveNestedProvider
} from './blocks.ts';
import type { Component } from './components.ts';
import type { Element } from './elements.ts';
import { asProperty, buildSelector } from './identifiers.ts';
import type { Block, Styles } from './types.ts';

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
    const root = this.buildSelector();

    this.addRule(root, current.styles);

    for (const [name, styles] of Object.entries(current.variants)) {
      this.addRule(`${root}.is-${name}`, styles);
    }

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
    const selector = this.buildSelector(...path);

    this.addRule(selector, current.styles);

    for (const [name, styles] of Object.entries(current.variants)) {
      this.addRule(`${selector}.is-${name}`, styles);
    }

    for (const [name, child] of Object.entries(current.children)) {
      this.addElementRules([...path, name], child);
    }
  }

  /**
   * Build a selector for a nested rule key
   */
  private buildNestedSelector(anchor: string, key: string): string {
    return key.startsWith('&')
      ? `${anchor}${key.slice(1)}`
      : `${anchor} ${key}`;
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
   * Build a selector for a component element
   */
  private buildSelector(...parts: string[]): string {
    return buildSelector([this.component.id, ...parts]);
  }

  /**
   * Format a CSS rule
   */
  private formatRule(
    selector: string,
    styles: Styles
  ): string | undefined {
    const properties = Object.keys(styles);

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
