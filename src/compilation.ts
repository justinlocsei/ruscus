import { buildComponentContext, buildElementContext } from './contexts.ts';
import { defineAbsoluteFragment, defineRelativeFragment } from './fragments.ts';
import type { NameGenerator, NamingScheme } from './naming.ts';
import { useNaming } from './naming.ts';
import { PropertyProjector } from './styles.ts';
import type { ComponentDefinition } from './types/components.ts';
import type { Declarations } from './types/css.ts';
import type { ElementDefinition } from './types/elements.ts';
import type { Fragment, ScopedFragments } from './types/fragments.ts';

/**
 * Options for compiling a component's CSS
 */
export type CompileConfig = {
  indentation?: number;
  naming?: NamingScheme;
  properties?: PropertyProjector;
};

/**
 * Generate CSS for a component's styles
 */
export function styleComponent(
  component: ComponentDefinition,
  config: CompileConfig = {}
): string {
  return new ComponentCompiler(component, config).compile();
}

class ComponentCompiler {
  private blocks: (string | null)[];
  private component: ComponentDefinition;
  private config: Required<CompileConfig>;
  private indent: string;
  private name: NameGenerator;

  /**
   * Create a compiler for a component's styles
   */
  constructor(
    component: ComponentDefinition,
    config: CompileConfig
  ) {
    this.config = {
      indentation: 2,
      naming: 'verbose',
      properties: new PropertyProjector(),
      ...config
    };

    this.blocks = [];
    this.component = component;
    this.indent = ' '.repeat(this.config.indentation);
    this.name = useNaming(component, config.naming);
  }

  /**
   * Produce CSS for the component's styles
   */
  compile(): string {
    const { component, name } = this;
    const { elements, variants } = component;

    const root = this.buildSelector();
    const context = buildComponentContext(component, { name });

    this.blocks.push(this.formatRule(root, component.styles));

    if (variants) {
      this.addVariantRules(
        root,
        variants(defineRelativeFragment, context)
      );
    }

    for (const [name, element] of Object.entries(elements)) {
      this.addElementStyles([name], element);
    }

    for (const provider of component.nested) {
      this.addRelativeFragmentRules(
        root,
        provider(defineRelativeFragment, context)
      );
    }

    for (const provider of component.global) {
      this.addGlobalFragmentRules(
        provider(defineAbsoluteFragment, context)
      );
    }

    return this.blocks.filter(Boolean).join('\n\n');
  }

  /**
   * Add base styles for a component's elements
   */
  private addElementStyles(path: string[], element: ElementDefinition): void {
    const { children, variants } = element;
    const selector = this.buildSelector(...path);

    const context = buildElementContext(
      [this.component.id, ...path],
      element,
      { name: this.name }
    );

    this.blocks.push(this.formatRule(selector, element.styles));

    if (variants) {
      this.addVariantRules(
        selector,
        variants(defineRelativeFragment, context)
      );
    }

    for (const provider of element.nested) {
      this.addRelativeFragmentRules(
        selector,
        provider(defineRelativeFragment, context)
      );
    }

    for (const [name, child] of Object.entries(children)) {
      this.addElementStyles([...path, name], child);
    }
  }

  /**
   * Add variant rules for component or element variants
   */
  private addVariantRules(
    anchor: string,
    definitions: ScopedFragments
  ): void {
    for (const [name, fragment] of Object.entries(definitions)) {
      this.blocks.push(
        this.formatFragmentRules(
          `${anchor}.${this.name.forVariant(name)}`,
          fragment
        )
      );
    }
  }

  /**
   * Add global fragment rules
   */
  private addGlobalFragmentRules(
    definitions: ScopedFragments<'absolute'>
  ): void {
    for (const [key, fragment] of Object.entries(definitions)) {
      this.blocks.push(this.formatFragmentRules(key, fragment));
    }
  }

  /**
   * Add relative fragment rules
   */
  private addRelativeFragmentRules(
    anchor: string,
    definitions: ScopedFragments<'relative'>
  ): void {
    for (const [key, fragment] of Object.entries(definitions)) {
      this.blocks.push(
        this.formatFragmentRules(
          this.buildNestedSelector(anchor, key),
          fragment
        )
      );
    }
  }

  /**
   * Format a fragment as CSS at a selector
   */
  private formatFragmentRules(
    parentSelector: string,
    fragment: Fragment
  ): string | null {
    const { nested, root: styles } = fragment.styles;
    const nestedEntries = Object.entries(nested);

    if (nestedEntries.length === 0) {
      return this.formatRule(parentSelector, styles);
    }

    const hoisted: string[] = [];
    const nestedRules: string[] = [];

    for (const [key, child] of nestedEntries) {
      if (key.includes('&')) {
        const rule = this.formatFragmentRules(
          this.expandSelectorAnchor(parentSelector, key),
          child
        );

        if (rule) {
          hoisted.push(rule);
        }

        continue;
      }

      const rule = this.formatFragmentRules(key, child);

      if (rule) {
        nestedRules.push(rule);
      }
    }

    const declarations = this.formatDeclarations(styles);

    const nestedBlock = nestedRules.length
      ? this.formatNestedBlock(
        parentSelector,
        [
          ...(declarations ? [declarations] : []),
          ...nestedRules
        ]
      )
      : this.formatRule(parentSelector, styles);

    const blocks = [nestedBlock, ...hoisted].filter(b => b !== null);

    return blocks.length
      ? blocks.join('\n\n')
      : null;
  }

  /**
   * Format declaration as key/value pairs
   */
  private formatDeclarations(styles: Declarations): string | null {
    const { config: { properties }, indent } = this;

    const props = Object
      .entries(styles)
      .filter(([_, v]) => v !== undefined);

    if (props.length === 0) {
      return null;
    }

    return props
      .map(([p]) => `${indent}${properties.project(p)}: ${styles[p]};`)
      .join('\n');
  }

  /**
   * Wrap nested rules in a selector block
   */
  private formatNestedBlock(selector: string, inner: string[]): string {
    const { indent } = this;

    const body = inner
      .map(rule =>
        rule
          .split('\n')
          .map(line => `${indent}${line}`)
          .join('\n')
      )
      .join('\n\n');

    return `${selector} {\n${body}\n}`;
  }

  /**
   * Replace every & in a nested key with the anchor selector
   */
  private expandSelectorAnchor(anchor: string, key: string): string {
    return key.replaceAll('&', anchor);
  }

  /**
   * Build a selector for a nested rule key
   */
  private buildNestedSelector(anchor: string, key: string): string {
    if (key.includes('&')) {
      return this.expandSelectorAnchor(anchor, key);
    } else if (key === anchor) {
      return anchor;
    } else {
      return `${anchor} ${key}`;
    }
  }

  /**
   * Build a selector for a component element
   */
  private buildSelector(...parts: string[]): string {
    return `.${this.name.forClass([this.component.id, ...parts])}`;
  }

  /**
   * Format a CSS rule
   */
  private formatRule(
    selector: string,
    styles: Declarations
  ): string | null {
    const body = this.formatDeclarations(styles);

    return body === null
      ? null
      : `${selector} {\n${body}\n}`;
  }
}
