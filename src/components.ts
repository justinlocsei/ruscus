import Builder from './builder.ts';
import type { CompileConfig } from './css.ts';
import { styleComponent } from './css.ts';
import type {
  ElementProviders,
  NamedElements,
  ProvidersToSpecs
} from './elements.ts';
import { defineElement, resolveElements } from './elements.ts';
import type { InternalComponent } from './internal.ts';
import { annotateComponent } from './internal.ts';
import { projectComponent, projectIdentifiers } from './projection.ts';
import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { applyTraits } from './traits.ts';
import type {
  AnyComponentSpec,
  EmptyComponentSpec,
  GlobalProvider,
  IdentifiersContext,
  NamedIdentifiers,
  PatchComponentSpec
} from './types/components.ts';
import type { Styles } from './types/css.ts';
import type {
  NestedContext,
  NestedProvider,
  VariantProvider,
  VariantsFromProvider
} from './types/elements.ts';
import { cast } from './utils.ts';

/**
 * Options for creating a component
 */
type ComponentOptions = {
  namespace?: string;
};

/**
 * Define the context available to providers of derived component styles
 */
type ContextFor<S extends AnyComponentSpec> =
  & NestedContext<S['els'], S['variants']>
  & IdentifiersContext<S['ids']>;

/**
 * The current state of a component
 */
type ComponentState<S extends AnyComponentSpec = AnyComponentSpec> = {
  elements: NamedElements;
  global: GlobalProvider[];
  identifiers: NamedIdentifiers;
  nested: NestedProvider[];
  styles: Styles;
  variants?: VariantProvider<ContextFor<S>>;
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
  PatchComponentSpec<S, { ids: I }>
>;

/**
 * Apply variant constraints to a component
 */
type WithVariants<
  S extends AnyComponentSpec,
  P extends VariantProvider<ContextFor<S>>
> = Component<
  PatchComponentSpec<S, { variants: VariantsFromProvider<P> }>
>;

export class Component<S extends AnyComponentSpec>
  extends Builder<ComponentState<S>>
{
  id: string;

  private name: string;
  private options: ComponentOptions;

  /**
   * Create a component
   */
  constructor(name: string, options: ComponentOptions = {}) {
    super({
      elements: {},
      global: [],
      identifiers: {},
      nested: [],
      styles: {}
    });

    this.name = name;
    this.options = options;

    this.id = [this.options.namespace, this.name]
      .filter(Boolean)
      .join('--');
  }

  /**
   * Project the component into class names and identifiers
   */
  apply(): InternalComponent<S> {
    return annotateComponent(projectComponent(this), {
      buildPlan: {
        compile: (config: CompileConfig = {}) => styleComponent(this, config),
        component: this as AnyComponent
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
      ctx: IdentifiersContext<S['ids']>
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
    applyTraits(this.current, traits);

    return this;
  }

  /**
   * Define global styles for the component
   */
  global(definitions: GlobalProvider<ContextFor<S>>): Component<S> {
    this.current.global.push(
      definitions as GlobalProvider
    );

    return this;
  }

  /**
   * Define nested styles for the component
   */
  nested(definitions: NestedProvider<ContextFor<S>>): Component<S> {
    this.current.nested.push(
      definitions as NestedProvider
    );

    return this;
  }

  /**
   * Define variants for the component root
   */
  variants<P extends VariantProvider<ContextFor<S>>>(
    provider: P
  ): WithVariants<S, P> {
    this.setStateField('variants', provider);

    return cast<WithVariants<S, P>>(this);
  }
}

/**
 * The most inclusive form of a component class
 */
export type AnyComponent = Component<AnyComponentSpec>;

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
