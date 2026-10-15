import type { ComponentDefinition } from './types/components.ts';
import type { ElementDefinitions } from './types/elements.ts';

/**
 * A generator for class names
 */
export type NameGenerator = (levels: readonly string[]) => string;

/**
 * An available naming schema for classes
 */
export type NamingScheme = 'compact' | 'verbose';

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
 * Create a name generator for a component
 */
export function useNaming(
  component: ComponentDefinition,
  scheme: NamingScheme = 'verbose'
): NameGenerator {
  switch (scheme) {
    case 'compact':
      return createCompactNameGenerator(component);

    case 'verbose':
      return ls => ls.join('__');
  }
}

/**
 * Build a generator for compact class names
 */
function createCompactNameGenerator(
  component: ComponentDefinition
): NameGenerator {
  const prefix = hash(component.id);
  const suffixByPath = buildPathSuffixMap(component.elements);

  return levels => classNameForLevels(levels, prefix, suffixByPath);
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
 * Map each element path to a compact suffix (stable depth-first, sorted keys)
 */
function buildPathSuffixMap(
  elements: ElementDefinitions
): ReadonlyMap<string, string> {
  const paths = collectElementPaths(elements).sort(comparePaths);
  const suffixByPath = new Map<string, string>();

  for (const [index, path] of paths.entries()) {
    suffixByPath.set(pathKey(path), encodeSuffix(index + 1));
  }

  return suffixByPath;
}

function classNameForLevels(
  levels: readonly string[],
  prefix: string,
  suffixByPath: ReadonlyMap<string, string>
): string {
  if (levels.length <= 1) {
    return prefix;
  }

  const suffix = suffixByPath.get(pathKey(levels.slice(1)));

  if (suffix === undefined) {
    throw new Error(
      `Unknown element path for compact naming: ${levels.join(' / ')}`
    );
  }

  return `${prefix}_${suffix}`;
}

function collectElementPaths(
  elements: ElementDefinitions,
  base: readonly string[] = []
): string[][] {
  const paths: string[][] = [];

  for (const name of Object.keys(elements).sort()) {
    const element = elements[name];

    if (element === undefined) {
      continue;
    }

    const path = [...base, name];
    paths.push(path);
    paths.push(...collectElementPaths(element.children, path));
  }

  return paths;
}

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

function pathKey(segments: readonly string[]): string {
  return segments.join('\0');
}
