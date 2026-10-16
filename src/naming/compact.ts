import type { ComponentDefinition } from '../types/components.ts';
import type { ElementDefinitions } from '../types/elements.ts';
import { Naming } from './shared.ts';

const SEPARATOR = '\0';

/**
 * A mapping of element paths to compact suffixes
 */
type Suffixes = Map<string, string>;

export class CompactNaming extends Naming {
  private prefix: string;
  private suffixes: Suffixes;

  /**
   * Build compact suffixes for all element paths
   */
  constructor(component: ComponentDefinition) {
    super(component);

    this.prefix = hash(component.id);
    this.suffixes = this.buildSuffixes(component.elements);
  }

  /**
   * Generate a compact class name
   */
  generate(levels: string[]): string {
    if (levels.length <= 1) {
      return this.prefix;
    }

    const suffix = this.suffixes.get(levels.slice(1).join(SEPARATOR));

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
  private buildSuffixes(
    elements: ElementDefinitions
  ): Suffixes {
    const paths = this
      .collectElementPaths(elements)
      .sort((alfa, bravo) => alfa.localeCompare(bravo));

    const suffixes: Suffixes = new Map();

    for (const [index, path] of paths.entries()) {
      suffixes.set(path, indexToLetters(index + 1));
    }

    return suffixes;
  }

  /**
   * Collect element paths in depth-first order
   */
  private collectElementPaths(
    elements: ElementDefinitions,
    base = ''
  ): string[] {
    const paths: string[] = [];

    for (const name of Object.keys(elements).sort()) {
      const element = elements[name];

      if (element === undefined) {
        continue;
      }

      const path = base.length === 0 ? name : `${base}${SEPARATOR}${name}`;

      paths.push(path);
      paths.push(...this.collectElementPaths(element.children, path));
    }

    return paths;
  }
}

/**
 * Encode a 1-based index as a series of lowercase letters
 */
function indexToLetters(index: number): string {
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
 * Build a short hash for a value using a 32-bit FNV-1a algorithm
 */
function hash(value: string, length = 6): string {
  let hash = 2_166_136_261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0)
    .toString(36)
    .slice(0, length)
    .padStart(length, '0');
}
