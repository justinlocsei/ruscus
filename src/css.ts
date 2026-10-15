import {
  buildNestedContext,
  resolveGlobalProvider,
  resolveNestedProvider,
  resolveVariantProvider
} from './blocks.ts';
import type { Element } from './elements.ts';
import type { NameGenerator, NamingScheme } from './naming.ts';
import { useNaming } from './naming.ts';
import type { ComponentDefinition } from './types/components.ts';
import type { Declarations } from './types/css.ts';
import type {
  ElementDefinition,
  NestedContext,
  VariantsProvider
} from './types/elements.ts';
import type {
  Fragment,
  Scope as FragmentScope,
  ScopedFragments
} from './types/fragments.ts';

/**
 * Options for compiling a component's CSS
 */
export type CompileConfig = {
  indentation?: number;
  naming?: NamingScheme;
};

/**
 * Project a camel-cased value as a CSS property name
 */
export function asProperty(camel: string): string {
  return camel.replace(
    /[A-Z]/g,
    l => `-${l.toLowerCase()}`
  );
}

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
  private config: Required<Omit<CompileConfig, 'naming'>>;
  private name: NameGenerator;

  /**
   * Create a compiler for a component's styles
   */
  constructor(
    component: ComponentDefinition,
    config: CompileConfig
  ) {
    this.blocks = [];

    this.component = component;
    this.config = { indentation: 2, ...config };
    this.name = useNaming(component, config.naming);
  }

  /**
   * Produce CSS for the component's styles
   */
  compile(): string {
    const { component } = this;
    const { elements, variants } = component;
    const root = this.buildSelector();

    const styleContext = {
      ...buildNestedContext([this.component.id], elements, {
        name: this.name
      }),
      ...buildIdentifiersContext(
        this.component.id,
        component.identifiers
      )
    } satisfies NestedContext;

    this.addRule(root, component.styles);

    if (variants) {
      this.addVariantFragmentRules(
        root,
        variants,
        styleContext
      );
    }

    for (
      const [name, element] of Object.entries(elements)
    ) {
      this.addElementStyles([name], element);
    }

    for (const provider of component.nested) {
      this.addScopedFragmentRules(
        root,
        resolveNestedProvider(provider, styleContext)
      );
    }

    for (
      const [name, element] of Object.entries(elements)
    ) {
      this.addElementNested([name], element);
    }

    for (const provider of component.global) {
      this.addGlobalFragmentRules(
        resolveGlobalProvider(provider, styleContext)
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

    this.addRule(selector, element.styles);

    const elementContext = buildNestedContext(
      [this.component.id, ...path],
      children,
      { name: this.name }
    );

    if (variants) {
      this.addVariantFragmentRules(
        selector,
        variants,
        elementContext
      );
    }

    for (const [name, child] of Object.entries(children)) {
      this.addElementStyles([...path, name], child);
    }
  }

  /**
   * Add nested rules for a component's elements
   */
  private addElementNested(path: string[], element: ElementDefinition): void {
    const { children } = element;
    const selector = this.buildSelector(...path);

    const elementContext = buildNestedContext(
      [this.component.id, ...path],
      children,
      { name: this.name }
    );

    for (const provider of element.nested) {
      this.addScopedFragmentRules(
        selector,
        resolveNestedProvider(provider, elementContext)
      );
    }

    for (const [name, child] of Object.entries(children)) {
      this.addElementNested([...path, name], child);
    }
  }

  /**
   * Add variant fragment rules anchored to a selector
   */
  private addVariantFragmentRules<C extends NestedContext>(
    anchor: string,
    provider: VariantsProvider<C>,
    ctx: C
  ): void {
    const definitions = resolveVariantProvider(provider, ctx);

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
  private addGlobalFragmentRules(definitions: ScopedFragments): void {
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
    definitions: ScopedFragments
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
   * Format declaration lines without a selector wrapper
   */
  private formatDeclarations(styles: Declarations): string | undefined {
    const properties = Object
      .entries(styles)
      .filter(([_, v]) => v !== undefined)
      .map(([k]) => k);

    if (properties.length === 0) {
      return undefined;
    }

    const indent = ' '.repeat(this.config.indentation);

    return properties
      .map(p => `${indent}${asProperty(p)}: ${styles[p]};`)
      .join('\n');
  }

  /**
   * Wrap nested rules in a selector block
   */
  private formatNestedBlock(selector: string, inner: string[]): string {
    const indent = ' '.repeat(this.config.indentation);

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
