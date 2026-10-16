import type { ComponentDefinition } from '../types/components.ts';
import type { ElementDefinitions } from '../types/elements.ts';
import { Naming } from './shared.ts';

/**
 * A mapping of element paths to compact suffixes
 */
type Suffixes = Map<string, string>;

export class CompactNaming extends Naming {
  private prefix: string;
  private suffixByPath: Suffixes;

  /**
   * Build compact suffixes for all element paths
   */
  constructor(component: ComponentDefinition) {
    super(component);

    this.prefix = hash(component.id);
    this.suffixByPath = this.buildPathSuffixMap(component.elements);
  }

  /**
   * Generate a compact class name
   */
  generate(levels: string[]): string {
    if (levels.length <= 1) {
      return this.prefix;
    }

    const suffix = this.suffixByPath.get(pathKey(levels.slice(1)));

    if (suffix === undefined) {
      throw new Error(
        `Unknown element path for compact naming: ${levels.join(' / ')}`
      );
    }

    return `${this.prefix}_${suffix}`;
  }

  /**
   * Map each element path to a compact suffix
   */
  private buildPathSuffixMap(
    elements: ElementDefinitions
  ): Suffixes {
    const paths = this
      .collectElementPaths(elements)
      .sort(comparePaths);

    const suffixes: Suffixes = new Map();

    for (const [index, path] of paths.entries()) {
      suffixes.set(pathKey(path), encodeSuffix(index + 1));
    }

    return suffixes;
  }

  /**
   * Collect element paths in depth-first order
   */
  private collectElementPaths(
    elements: ElementDefinitions,
    base: string[] = []
  ): string[][] {
    const paths: string[][] = [];

    for (const name of Object.keys(elements).sort()) {
      const element = elements[name];

      if (element === undefined) {
        continue;
      }

      const path = [...base, name];

      paths.push(path);
      paths.push(...this.collectElementPaths(element.children, path));
    }

    return paths;
  }
}

/**
 * Compare two element paths for stable sorting
 */
function comparePaths(alfa: string[], bravo: string[]): number {
  const length = Math.max(alfa.length, bravo.length);

  for (let index = 0; index < length; index++) {
    const left = alfa[index];
    const right = bravo[index];

    if (left === undefined) {
      return -1;
    }

    if (right === undefined) {
      return 1;
    }

    if (left < right) {
      return -1;
    }

    if (left > right) {
      return 1;
    }
  }

  return 0;
}

/**
 * Encode a 1-based index as a lowercase letter suffix (a, b, …, z, aa, …)
 */
function encodeSuffix(index: number): string {
  let remaining = index;
  let encoded = '';

  while (remaining > 0) {
    remaining -= 1;
    encoded = String.fromCharCode(97 + (remaining % 26)) + encoded;
    remaining = Math.floor(remaining / 26);
  }

  return encoded;
}

/**
 * Build a short hash for a value
 */
function hash(value: string): string {
  let hash = 2_166_136_261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(36).slice(0, 4).padStart(4, '0');
}

/**
 * Build a map key for an element path
 */
function pathKey(segments: readonly string[]): string {
  return segments.join('\0');
}
