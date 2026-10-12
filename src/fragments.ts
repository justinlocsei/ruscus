import { mergeStyles } from './styles.ts';
import type { Styles } from './types.ts';

/**
 * The scope of a fragment
 */
export type FragmentScope = 'absolute' | 'relative';

/**
 * Fragment definitions keyed by selector
 */
export type FragmentDefinitions<S extends FragmentScope = FragmentScope> =
  Record<string, Fragment<S>>;

/**
 * The current state of a fragment
 */
type FragmentState = {
  nested: FragmentDefinitions;
  styles: Styles;
};

/**
 * Create an absolute fragment with initial CSS
 */
export function defineAbsoluteFragment(
  styles: Styles = {}
): Fragment<'absolute'> {
  return new Fragment('absolute').css(styles);
}

/**
 * Create a relative fragment with initial CSS
 */
export function defineRelativeFragment(
  styles: Styles = {}
): Fragment<'relative'> {
  return new Fragment('relative').css(styles);
}

/**
 * An absolute-fragment factory
 */
export type AbsoluteFragmentFactory = typeof defineAbsoluteFragment;

/**
 * A relative-fragment factory
 */
export type RelativeFragmentFactory = typeof defineRelativeFragment;

export class Fragment<S extends FragmentScope = FragmentScope> {
  current: FragmentState;
  scope: S;

  /**
   * Create a fragment
   */
  constructor(scope: S) {
    this.scope = scope;

    this.current = {
      nested: {},
      styles: {}
    };
  }

  /**
   * Apply CSS declarations to the fragment
   */
  css(styles: Styles): Fragment<S> {
    this.current.styles = mergeStyles(this.current.styles, styles);

    return this;
  }

  /**
   * Define nested styles
   */
  nested(definitions: FragmentDefinitions): Fragment<S> {
    this.updateState('nested', definitions);

    return this;
  }

  /**
   * Update a field in the current state
   *
   * @throws if the field already has a value
   */
  private updateState<T extends keyof FragmentState>(
    field: T,
    value: FragmentState[T]
  ): void {
    if (Object.keys(this.current[field]).length) {
      throw new Error('nested may only be called once');
    }

    this.current[field] = value;
  }
}
