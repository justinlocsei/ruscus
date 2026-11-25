import type { Styles } from './types/css.ts';

/**
 * Convert a camel-cased value to kebab case
 */
export function camelToKebab(camel: string): string {
  return camel.startsWith('--') ? camel : camel.replace(
    /[A-Z]/g,
    l => `-${l.toLowerCase()}`
  );
}

/**
 * Define styles
 */
export function defineStyles<T extends Styles>(styles: T): T {
  return styles;
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

/**
 * Split a selector into its individual segments
 */
export function splitSelector(selector: string): string[] {
  if (!selector.includes(',')) {
    return [selector];
  }

  const parts: string[] = [];
  let bracket = 0;
  let paren = 0;
  let start = 0;

  for (let index = 0; index < selector.length; index++) {
    const char = selector[index];

    if (char === '(') {
      paren++;
    } else if (char === ')') {
      paren--;
    } else if (char === '[') {
      bracket++;
    } else if (char === ']') {
      bracket--;
    } else if (char === ',' && bracket === 0 && paren === 0) {
      parts.push(selector.slice(start, index));
      start = index + 1;
    }
  }

  parts.push(selector.slice(start));

  return parts.filter(Boolean);
}

/**
 * Replace every & in a nested key with the anchor selector
 */
export function expandSelectorAnchor(anchor: string, key: string): string {
  return splitSelector(anchor)
    .map(part => key.replaceAll('&', part.trim()))
    .join(', ');
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
