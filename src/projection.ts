import type { Component } from './components.ts';
import type { NameGenerator, NamingScheme } from './naming.ts';
import { useNaming } from './naming.ts';
import { asProperty } from './styles.ts';
import type {
  AnyComponentSpec,
  IdentifierValuesFor
} from './types/components.ts';
import type {
  ElementDefinition,
  ElementDefinitions
} from './types/elements.ts';
import { ELEMENT_ROOT } from './types/ids.ts';
import type {
  ApplicableComponent,
  VariantProjector
} from './types/projection.ts';

/**
 * Project a component
 */
export function projectComponent<S extends AnyComponentSpec>(
  component: Component<S>,
  { naming }: { naming?: NamingScheme } = {}
): ComponentProjector<S> {
  return new ComponentProjector(
    component,
    useNaming(component.current, naming)
  );
}

class ComponentProjector<S extends AnyComponentSpec> {
  private component: Component<S>;
  private name: NameGenerator;

  /**
   * Create a projector for a component
   */
  constructor(component: Component<S>, name: NameGenerator) {
    this.component = component;
    this.name = name;
  }

  /**
   * Project the component into applicable class names
   */
  classNames(): ApplicableComponent<S> {
    const { component } = this;
    const { current } = component;

    const root = this.projectNode(
      this.name([component.id]),
      current.variants !== undefined
    );

    const elements = this.projectElements(
      [component.id],
      current.elements
    );

    return {
      ...elements,
      [ELEMENT_ROOT]: root
    } as ApplicableComponent<S>;
  }

  /**
   * Project the component's identifiers as a map of labels to values
   */
  identifiers(): IdentifierValuesFor<S> {
    const { current } = this.component;

    return Object.fromEntries(
      Object.entries(current.identifiers).map(([key, type]) => {
        const scoped = `${current.id}--${asProperty(key)}`;

        return [
          key,
          type === 'variable' ? `--${scoped}` : scoped
        ];
      })
    ) as IdentifierValuesFor<S>;
  }

  /**
   * Project an element as a lone class name or child projector
   */
  private projectElement(
    path: string[],
    element: ElementDefinition
  ): unknown {
    const root = this.projectNode(
      this.name(path),
      element.variants !== undefined
    );

    const { children } = element;

    return Object.keys(children).length
      ? { [ELEMENT_ROOT]: root, ...this.projectElements(path, children) }
      : root;
  }

  /**
   * Project an element tree into class names
   */
  private projectElements(
    namespace: string[],
    elements: ElementDefinitions
  ): Record<string, unknown> {
    return Object.entries(elements).reduce<Record<string, unknown>>(
      (previous, [key, element]) => {
        if (element === undefined) {
          return previous;
        }

        previous[key] = this.projectElement(
          [...namespace, key],
          element
        );

        return previous;
      },
      {} as Record<string, unknown>
    );
  }

  /**
   * Project a node as a class name or variant projector
   */
  private projectNode(
    className: string,
    hasVariants: boolean
  ): VariantProjector<string> | string {
    return hasVariants
      ? (...vs: string[]) => [className, ...vs.map(v => `is-${v}`)].join(' ')
      : className;
  }
}
