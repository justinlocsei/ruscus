import { buildComponentContext, buildElementContext } from './contexts.ts';
import { defineAbsoluteFragment, defineRelativeFragment } from './fragments.ts';
import type { NameGenerator, NamingScheme } from './naming.ts';
import { useNaming } from './naming.ts';
import { PropertyProjector } from './styles.ts';
import type { ComponentDefinition } from './types/components.ts';
import type { Declarations } from './types/css.ts';
import type { ElementDefinition } from './types/elements.ts';
import type {
  Fragment,
  FragmentScope,
  ScopedFragments
} from './types/fragments.ts';

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
  private blocks: string[];
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

    this.addRule(root, component.styles);

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
      this.addScopedFragmentRules(
        root,
        provider(defineRelativeFragment, context)
      );
    }

    for (const provider of component.global) {
      this.addGlobalFragmentRules(
        provider(defineAbsoluteFragment, context)
      );
    }

    return this.blocks.join('\n\n');
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

    this.addRule(selector, element.styles);

    if (variants) {
      this.addVariantRules(
        selector,
        variants(defineRelativeFragment, context)
      );
    }

    for (const provider of element.nested) {
      this.addScopedFragmentRules(
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
      const rule = this.formatFragmentRules(`${anchor}.is-${name}`, fragment);

      if (rule) {
        this.blocks.push(rule);
      }
    }
  }

  /**
   * Add global fragment rules
   */
  private addGlobalFragmentRules(
    definitions: ScopedFragments<'absolute'>
  ): void {
    for (const [key, fragment] of Object.entries(definitions)) {
      const rule = this.formatFragmentRules(
        this.selectorForFragmentKey('', key, fragment.scope),
        fragment
      );

      if (rule) {
        this.blocks.push(rule);
      }
    }
  }

  /**
   * Add scoped fragment rules anchored to a selector
   */
  private addScopedFragmentRules(
    anchor: string,
    definitions: ScopedFragments<'relative'>
  ): void {
    for (const [key, fragment] of Object.entries(definitions)) {
      const rule = this.formatFragmentRules(
        this.selectorForFragmentKey(anchor, key, fragment.scope),
        fragment
      );

      if (rule) {
        this.blocks.push(rule);
      }
    }
  }

  /**
   * Resolve a selector for a fragment map key
   */
  private selectorForFragmentKey(
    anchor: string,
    key: string,
    scope: FragmentScope
  ): string {
    if (scope === 'absolute') {
      return key;
    }

    return this.buildNestedSelector(anchor, key);
  }

  /**
   * Format a fragment as CSS at a selector
   */
  private formatFragmentRules(
    parentSelector: string,
    fragment: Fragment
  ): string | undefined {
    const { nested, root: styles } = fragment.styles;
    const nestedEntries = Object.entries(nested);

    if (nestedEntries.length === 0) {
      return this.formatRule(parentSelector, styles);
    }

    const inner: string[] = [];
    const declarations = this.formatDeclarations(styles);

    if (declarations) {
      inner.push(declarations);
    }

    for (const [key, child] of nestedEntries) {
      const selector = this.selectorForNestedKey(
        parentSelector,
        key,
        child.scope
      );

      const rule = this.formatFragmentRules(selector, child);

      if (rule) {
        inner.push(rule);
      }
    }

    if (inner.length === 0) {
      return undefined;
    }

    return this.formatNestedBlock(parentSelector, inner);
  }

  /**
   * Resolve a selector for a nested fragment key
   */
  private selectorForNestedKey(
    parentSelector: string,
    key: string,
    scope: FragmentScope
  ): string {
    if (key.startsWith('&')) {
      return `${parentSelector}${key.slice(1)}`;
    }

    if (scope === 'absolute') {
      return key;
    }

    return key;
  }

  /**
   * Format declaration as key/value pairs
   */
  private formatDeclarations(styles: Declarations): string | undefined {
    const { config: { properties }, indent } = this;

    const props = Object
      .entries(styles)
      .filter(([_, v]) => v !== undefined);

    if (props.length === 0) {
      return undefined;
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
   * Build a selector for a nested rule key
   */
  private buildNestedSelector(anchor: string, key: string): string {
    if (key.startsWith('&')) {
      return `${anchor}${key.slice(1)}`;
    }

    if (key === anchor) {
      return anchor;
    }

    return `${anchor} ${key}`;
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
    return `.${this.name([this.component.id, ...parts])}`;
  }

  /**
   * Format a CSS rule
   */
  private formatRule(
    selector: string,
    styles: Declarations
  ): string | undefined {
    const body = this.formatDeclarations(styles);

    if (!body) {
      return undefined;
    }

    return `${selector} {\n${body}\n}`;
  }
}
