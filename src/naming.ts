import type { Component } from './components.ts';
import type { NamedElements } from './elements.ts';
import { buildSelector } from './identifiers.ts';
import type { AnyComponentSpec } from './types.ts';

/**
 * Produce a bare class name from namespace levels (component id plus element path)
 */
export type NameGenerator = (levels: readonly string[]) => string;

/**
 * Built-in class naming schemes
 */
export type NamingScheme = 'compact' | 'verbose';

/**
 * Build a short, stable hash prefix from a component ID
 */
export function hashComponentId(id: string): string {
  let hash = 2_166_136_261;

  for (const character of id) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(36).slice(0, 4).padStart(4, '0');
}

/**
 * Create a name generator for a component
 */
export function useNaming<S extends AnyComponentSpec>(
  component: Component<S>,
  scheme: NamingScheme = 'verbose'
): NameGenerator {
  if (scheme === 'compact') {
    return createCompactNameGenerator(
      component.id,
      component.current.elements
    );
  }

  return createVerboseNameGenerator();
}

/**
 * BEM-style verbose names (default)
 */
export function createVerboseNameGenerator(): NameGenerator {
  return levels => buildSelector(levels).slice(1);
}

/**
 * Compact names: hashed component prefix and predictable local suffixes
 */
function createCompactNameGenerator(
  componentId: string,
  elements: NamedElements
): NameGenerator {
  const prefix = hashComponentId(componentId);
  const suffixByPath = buildPathSuffixMap(elements);

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
  elements: NamedElements
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
  elements: NamedElements,
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
    paths.push(...collectElementPaths(element.current.children, path));
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
