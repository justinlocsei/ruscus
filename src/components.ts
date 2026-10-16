import type { BuilderState } from './builder.ts';
import Builder from './builder.ts';
import type { CompileConfig } from './compilation.ts';
import { styleComponent } from './compilation.ts';
import type { ElementProviders, ProvidersToSpecs } from './elements.ts';
import { defineElement, resolveElements } from './elements.ts';
import type { InternalComponent } from './internal.ts';
import { annotateComponent } from './internal.ts';
import { projectComponent, projectIdentifiers } from './projection.ts';
import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { mergeTraits } from './traits.ts';
import type {
  AnyComponentSpec,
  AnyVariantsContext,
  ComponentDefinition,
  DerivedContext,
  ElementsContext,
  EmptyComponentSpec,
  GlobalProvider,
  NamedIdentifiers,
  NestedProvider,
  PatchComponentSpec,
  VariantsContext,
  VariantsProvider
} from './types/components.ts';
import type { Styles } from './types/css.ts';
import type { VariantsFromProvider } from './types/elements.ts';
import { cast } from './utils.ts';

/**
 * A wide, data-only form of a component class
 */
export type AnyComponent = BuilderState<ComponentDefinition>;

/**
 * Options for creating a component
 */
type ComponentOptions = {
  namespace?: string;
};

/**
 * Apply element constraints to a component
 */
type WithElements<
  S extends AnyComponentSpec,
  T extends ElementProviders
> = Component<
  PatchComponentSpec<S, { els: ProvidersToSpecs<T> }>
>;

/**
 * Apply identifier constraints to a component
 */
type WithIdentifiers<
  S extends AnyComponentSpec,
  I extends NamedIdentifiers
> = Component<
  PatchComponentSpec<S, { ids: keyof I & string }>
>;

/**
 * Apply variant constraints to a component
 */
type WithVariants<
  S extends AnyComponentSpec,
  P extends VariantsProvider<VariantsContext<S['els'], S['ids']>>
> = Component<
  PatchComponentSpec<S, { variants: VariantsFromProvider<P> }>
>;

export class Component<S extends AnyComponentSpec>
  extends Builder<ComponentDefinition>
{
  id: string;

  /**
   * Create a component
   */
  constructor(name: string, options: ComponentOptions = {}) {
    const id = [options.namespace, name]
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
  apply(): InternalComponent<S> {
    return annotateComponent(projectComponent(this), {
      buildPlan: {
        compile: (config: CompileConfig = {}) =>
          styleComponent(this.current, config),
        component: this.current
      },
      identifiers: projectIdentifiers(this)
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
  identifiers<I extends NamedIdentifiers>(types: I): WithIdentifiers<S, I> {
    this.setStateField('identifiers', types);

    return cast<WithIdentifiers<S, I>>(this);
  }

  /**
   * Define the component's elements
   */
  elements<T extends ElementProviders>(
    provider: (
      e: typeof defineElement,
      ctx: ElementsContext<S['ids']>
    ) => T
  ): WithElements<S, T> {
    this.current.elements = resolveElements(
      provider(
        defineElement,
        { ids: projectIdentifiers(this) }
      )
    );

    return cast<WithElements<S, T>>(this);
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
    definitions: GlobalProvider<
      DerivedContext<S['els'], S['variants'], S['ids']>
    >
  ): Component<S> {
    this.current.global.push(definitions as GlobalProvider);

    return this;
  }

  /**
   * Define nested styles for the component
   */
  nested(
    definitions: NestedProvider<
      DerivedContext<S['els'], S['variants'], S['ids']>
    >
  ): Component<S> {
    this.current.nested.push(definitions as NestedProvider);

    return this;
  }

  /**
   * Define variants for the component root
   */
  variants<P extends VariantsProvider<VariantsContext<S['els'], S['ids']>>>(
    provider: P
  ): WithVariants<S, P> {
    this.setStateField(
      'variants',
      provider as VariantsProvider<AnyVariantsContext>
    );

    return cast<WithVariants<S, P>>(this);
  }
}

/**
 * Define a component
 */
export function defineComponent(
  name: string,
  options: ComponentOptions = {}
): Component<EmptyComponentSpec> {
  return new Component(name, options);
}

/**
 * A factory for defining components
 */
export type ComponentFactory = typeof defineComponent;
