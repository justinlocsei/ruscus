import type { CompileConfig } from './css.ts';
import { styleComponent } from './css.ts';
import type {
  ElementProviders,
  NamedElements,
  ProvidersToSpecs
} from './elements.ts';
import { defineElement, resolveElements } from './elements.ts';
import { buildIdentifiersContext } from './identifiers.ts';
import type { BuildableComponent, BuildPlan } from './internal.ts';
import { buildPlan } from './internal.ts';
import { projectComponent } from './projection.ts';
import { mergeStyles } from './styles.ts';
import type { Trait } from './traits.ts';
import { applyTraits } from './traits.ts';
import type {
  AnyComponentSpec,
  ComponentSpec,
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

export class Component<
  S extends AnyComponentSpec = ComponentSpec
> {
  current: ComponentState<S>;
  id: string;

  private name: string;
  private options: ComponentOptions;

  /**
   * Create a component
   */
  constructor(name: string, options: ComponentOptions = {}) {
    this.name = name;
    this.options = options;

    this.current = {
      elements: {},
      global: [],
      identifiers: {},
      nested: [],
      styles: {}
    };

    this.id = [this.options.namespace, this.name]
      .filter(Boolean)
      .join('--');
  }

  /**
   * Project the component into class names and identifiers
   */
  apply(): BuildableComponent<S> {
    const applied = projectComponent(this);

    const value: BuildPlan<S> = {
      compile: (config: CompileConfig = {}) => styleComponent(this, config),
      component: this
    };

    Object.defineProperty(applied, buildPlan, {
      configurable: false,
      enumerable: false,
      value,
      writable: false
    });

    return applied as BuildableComponent<S>;
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
    this.updateState('identifiers', types);

    return this as WithIdentifiers<S, I>;
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
        buildIdentifiersContext(this.id, this.current.identifiers)
      )
    );

    return this as WithElements<S, T>;
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
    this.updateState('variants', provider);

    return this as WithVariants<S, P>;
  }

  /**
   * Update a field in the current state
   *
   * @throws if the field already has a value
   */
  private updateState<T extends keyof ComponentState<S>>(
    field: T,
    value: ComponentState<S>[T]
  ): void {
    const current = this.current[field];

    if (field === 'variants') {
      if (current !== undefined) {
        throw new Error(`${field} may only be called once`);
      }
    } else if (Object.keys(current as object).length) {
      throw new Error(`${field} may only be called once`);
    }

    this.current[field] = value;
  }
}

/**
 * Define a component
 */
export function defineComponent(
  name: string,
  options: ComponentOptions = {}
): Component {
  return new Component(name, options);
}

/**
 * A factory for defining components
 */
export type ComponentFactory = typeof defineComponent;
