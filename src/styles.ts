import type { Styles } from './types/css.ts';

/**
 * Convert a camel-cased value to kebab case
 */
export function camelToKebab(camel: string): string {
  return camel.replace(
    /[A-Z]/g,
    l => `-${l.toLowerCase()}`
  );
}

/**
 * Convert a kebab-cased value to camel case
 */
export function kebabToCamel(kebab: string): string {
  return kebab.replace(
    /-([a-z])/g,
    (_, letter: string) => letter.toUpperCase()
  );
}

/**
 * Merge multiple styles on top of a base
 */
export function mergeStyles(base: Styles, ...others: Styles[]): Styles {
  const merged = { ...base };

  for (const other of others) {
    Object.assign(merged, other);
  }

  return merged;
}

export class PropertyProjector {
  private names: Map<string, string>;

  /**
   * Create a mapper of camel-cased values to CSS properties
   */
  constructor() {
    this.names = new Map();
  }

  /**
   * Project a camel-cased value as a CSS property
   */
  project(camel: string): string {
    let prop = this.names.get(camel);

    if (prop === undefined) {
      prop = camelToKebab(camel);
      this.names.set(camel, prop);
    }

    return prop;
  }
}
