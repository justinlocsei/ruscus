import { mergeStyles } from './styles.ts';
import type { Styles } from './types.ts';

/**
 * Nested fragments keyed by selector
 */
type NestedFragments = Record<string, Fragment>;

/**
 * The current state of a fragment
 */
type FragmentState = {
  nested: NestedFragments;
  styles: Styles;
};

/**
 * Create a fragment with initial CSS
 */
export function defineFragment(styles: Styles = {}): Fragment {
  return new Fragment().css(styles);
}

/**
 * A fragment factory
 */
export type FragmentFactory = typeof defineFragment;

export class Fragment {
  current: FragmentState;

  /**
   * Create a fragment
   */
  constructor() {
    this.current = {
      nested: {},
      styles: {}
    };
  }

  /**
   * Apply CSS declarations to the fragment
   */
  css(styles: Styles): Fragment {
    this.current.styles = mergeStyles(this.current.styles, styles);

    return this;
  }

  /**
   * Define nested styles
   */
  nested(definitions: NestedFragments): Fragment {
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
