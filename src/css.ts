import {
  buildNestedContext,
  isDeclarations,
  resolveNestedProvider
} from './blocks.ts';
import type { Component } from './components.ts';
import type { Element } from './elements.ts';
import {
  asProperty,
  buildIdentifiersContext,
  buildSelector
} from './identifiers.ts';
import type {
  AnyComponentSpec,
  Block,
  Declarations,
  IdentifiersContext,
  NestedContext
} from './types.ts';

/**
 * Options for compiling a component's CSS
 */
export type CompileConfig = {
  indentation?: number;
};

/**
 * The context available in a component's nested definition
 */
type NestedComponentContext<S extends AnyComponentSpec> =
  & NestedContext<S['els'], S['variants']>
  & IdentifiersContext<S['ids']>;

/**
 * Generate CSS for a component's styles
 */
export function styleComponent<S extends AnyComponentSpec>(
  component: Component<S>,
  config: CompileConfig = {}
): string {
  return new ComponentCompiler(
    component as Component<AnyComponentSpec>,
    config
  ).compile();
}

class ComponentCompiler {
  private blocks: string[];
  private component: Component<AnyComponentSpec>;
  private config: Required<CompileConfig>;

  /**
   * Create a compiler for a component's styles
   */
  constructor(
    component: Component<AnyComponentSpec>,
    config: CompileConfig
  ) {
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

    this.addNestedRules(
      root,
      resolveNestedProvider(current.nested, {
        ...buildNestedContext([this.component.id], current.elements),
        ...buildIdentifiersContext(
          this.component.id,
          current.identifiers
        )
      })
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
    const selector = this.buildSelector(...path);

    this.addRule(selector, current.styles);

    for (const [name, styles] of Object.entries(current.variants)) {
      this.addRule(`${selector}.is-${name}`, styles);
    }

    this.addNestedRules(
      selector,
      resolveNestedProvider(
        current.nested,
        buildNestedContext(
          [this.component.id, ...path],
          current.children
        )
      )
    );

    for (const [name, child] of Object.entries(current.children)) {
      this.addElementRules([...path, name], child);
    }
  }

  /**
   * Add nested rules anchored to a selector
   */
  private addNestedRules(root: string, block: Block): void {
    if (isDeclarations(block)) {
      this.addRule(root, block);
    } else {
      for (const [key, value] of Object.entries(block)) {
        this.addNestedRules(
          this.buildNestedSelector(root, key),
          value
        );
      }
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
  private addRule(selector: string, declarations: Declarations): void {
    const rule = this.formatRule(selector, declarations);

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
    styles: Declarations
  ): string | undefined {
    const properties = Object
      .entries(styles)
      .filter(([_, v]) => v !== undefined)
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
