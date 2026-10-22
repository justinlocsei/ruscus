import type { BuilderState } from './builder.ts';
import Builder from './builder.ts';
import type { CompileConfig } from './compilation.ts';
import { styleComponent } from './compilation.ts';
import type { ElementProviders, ProvidersToSpecs } from './elements.ts';
import { defineElement, resolveElements } from './elements.ts';
import type { ApplicableComponent } from './internal.ts';
import { annotateComponent } from './internal.ts';
import { useNaming } from './naming.ts';
import { projectIdentifiers } from './projection/identifiers.ts';
import { projectComponent } from './projection.ts';
import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { mergeTraits } from './traits.ts';
import type {
  ComponentDefinition,
  ComponentSpec,
  DerivedComponentContext,
  DerivedComponentStyles,
  EmptyComponentSpec,
  IdentifierValuesFor,
  NamedIdentifiers
} from './types/components.ts';
import type { Styles } from './types/css.ts';
import type { VariantsFromProvider } from './types/elements.ts';
import { cast } from './utils.ts';

/**
 * A wide, data-only form of a component class
 */
export type AnyComponent = BuilderState<ComponentDefinition>;

export class Component<S extends ComponentSpec = ComponentSpec>
  extends Builder<ComponentDefinition>
{
  id: string;

  /**
   * Create a component
   */
  constructor(
    name: string,
    { namespace = [] }: { namespace?: string[] } = {}
  ) {
    const id = [...namespace, name]
      .filter(Boolean)
      .join('--');

    super({
      elements: {},
      global: [],
      id,
      identifiers: {},
      nested: [],
      styles: {}
    });

    this.id = id;
  }

  /**
   * Project the component into class names and identifiers
   */
  apply(): ApplicableComponent<S> {
    const name = useNaming(this.current);

    return annotateComponent(projectComponent(this, name), {
      buildPlan: {
        compile: (config: CompileConfig = {}) =>
          styleComponent(this.current, config),
        component: this.current
      },
      identifiers: cast<IdentifierValuesFor<S>>(
        projectIdentifiers(this.current)
      )
    });
  }

  /**
   * Apply styles to the component root
   */
  css(styles: Styles): Component<S> {
    const { current } = this;
    current.styles = mergeStyles(current.styles, styles);

    return this;
  }

  /**
   * Define component-specific identifiers
   */
  identifiers<I extends NamedIdentifiers>(
    types: I
  ): Component<ComponentSpec<S['els'], S['variants'], keyof I & string>> {
    this.setStateField('identifiers', types);

    return this;
  }

  /**
   * Define the component's elements
   */
  elements<T extends ElementProviders>(
    provider: (
      e: typeof defineElement,
      ctx: Pick<DerivedComponentContext<S>, 'ids'>
    ) => T
  ): Component<
    ComponentSpec<ProvidersToSpecs<T>, S['variants'], S['ids']>
  > {
    this.setStateField(
      'elements',
      resolveElements(
        provider(
          defineElement,
          { ids: projectIdentifiers(this.current) }
        )
      )
    );

    // biome-ignore lint/suspicious/noExplicitAny: avoid a duplicate signature in a cast
    return this as any;
  }

  /**
   * Apply reusable trait styles and nested rules
   */
  is(...traits: Trait[]): Component<S> {
    const { nested, root } = mergeTraits(...traits);

    this.current.styles = mergeStyles(this.current.styles, root);

    if (Object.keys(nested).length > 0) {
      this.current.nested.push(() => nested);
    }

    return this;
  }

  /**
   * Define global styles for the component
   */
  global(
    definitions: DerivedComponentStyles<
      'absolute',
      DerivedComponentContext<S>
    >
  ): Component<S> {
    this.current.global.push(
      definitions as DerivedComponentStyles<'absolute'>
    );

    return this;
  }

  /**
   * Define nested styles for the component
   */
  nested(
    definitions: DerivedComponentStyles<'relative', DerivedComponentContext<S>>
  ): Component<S> {
    this.current.nested.push(
      definitions as DerivedComponentStyles<'relative'>
    );

    return this;
  }

  /**
   * Define variants for the component root
   */
  variants<
    P extends DerivedComponentStyles<
      'relative',
      Omit<DerivedComponentContext<S>, 'variants'>
    >
  >(
    provider: P
  ): Component<
    ComponentSpec<S['els'], VariantsFromProvider<P>, S['ids']>
  > {
    this.setStateField(
      'variants',
      provider as unknown as DerivedComponentStyles
    );

    // biome-ignore lint/suspicious/noExplicitAny: avoid a duplicate signature in a cast
    return this as any;
  }
}

/**
 * Define a component
 */
export function defineComponent(name: string): Component<EmptyComponentSpec> {
  return new Component(name);
}

/**
 * A factory for defining components
 */
export type ComponentFactory = typeof defineComponent;

/**
 * Create a factory to produce namespaced components
 */
export function defineComponentNamespace(
  ...namespace: string[]
): ComponentFactory {
  return (name: string) => new Component(name, { namespace });
}
