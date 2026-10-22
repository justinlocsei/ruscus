import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import css from '@webref/css';
import { definitionSyntax } from 'css-tree';

const TYPES = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/types/css/properties.ts'
);

// Values shared by all CSS properties
const SHARED = [
  'inherit',
  'initial',
  'revert',
  'revert-layer',
  'unset'
] as const;

// The minimum percentage overlap of values to consider them aliases
const MIN_VALUE_OVERLAP = 0.75;

/**
 * An alias for a set of CSS values
 */
type Alias = {
  name: string;
  source: string;
};

/**
 * A group of properties that share a set of values
 */
type AliasGroup = {
  props: Set<Property>;
  values: string[];
};

/**
 * A CSS property and its supported values
 */
type Property = {
  aliases?: string[];
  name: string;
  values: string[];
};

/**
 * Convert a kebab-case string to camel case
 */
function kebabToCamel(kebab: string): string {
  return kebab.replace(
    /-([a-z])/g,
    (_, letter: string) => letter.toUpperCase()
  );
}

/**
 * Convert a camel-case string to Pascal case
 */
function camelToPascal(camel: string): string {
  return camel[0]!.toUpperCase() + camel.slice(1);
}

/**
 * Render a union of values as a string
 */
function renderUnion(values: string[]): string {
  return values.join(' | ');
}

/**
 * Determine the percentage overlap of two sets of values
 */
function calculateOverlap(left: string[], right: string[]): number {
  const rightValues = new Set(right);
  const shared = left.filter(v => rightValues.has(v));

  return shared.length / Math.max(left.length, right.length);
}

/**
 * Calculat the intersection of two sets of values
 */
function intersectValues(left: string[], right: string[]): string[] {
  const rightValues = new Set(right);

  return [...new Set(left)].filter(v => rightValues.has(v));
}

/**
 * Find alises for values shared across properties
 */
function findAliases(props: Property[]): AliasGroup[] {
  const groups = new Map<string, AliasGroup>();
  const candidates = props.filter(p => p.values.length > 0);

  for (const prop of candidates) {
    const matching = candidates.filter(
      p => calculateOverlap(prop.values, p.values) >= MIN_VALUE_OVERLAP
    );

    if (matching.length < 2) {
      continue;
    }

    const values = matching
      .slice(1)
      .reduce(
        (previous, p) => intersectValues(previous, p.values),
        matching[0]!.values
      );

    const consumers = matching.filter(
      p => calculateOverlap(values, p.values) >= MIN_VALUE_OVERLAP
    );

    if (consumers.length < 2) {
      continue;
    }

    const key = values.join('\u0000');
    const group = groups.get(key) ?? { props: new Set(), values };

    for (const consumer of consumers) {
      group.props.add(consumer);
    }

    groups.set(key, group);
  }

  return [...groups.values()].sort((left, right) =>
    right.values.length - left.values.length
    || left.values[0]!.localeCompare(right.values[0]!)
  );
}

/**
 * Extract aliases for values shared across properties
 */
function extractAliases(props: Property[]): Alias[] {
  const aliases: Alias[] = [];

  const usedNames = new Set([
    'AuthorValue',
    'KnownProperties',
    'Value'
  ]);

  // This runs multiple times until no more aliases can be found.  The
  // properties in props are mutated during each iteration, resulting in a
  // different set of available values for each pass.
  while (true) {
    let extracted = false;

    for (const alias of findAliases(props)) {
      const consumers = [...alias.props].filter(p =>
        alias.values.every(v => p.values.includes(v))
      );

      if (consumers.length < 2) {
        continue;
      }

      const shortest = [...consumers].sort(
        (left, right) =>
          left.name.length - right.name.length
          || left.name.localeCompare(right.name)
      )[0]!;

      const base = camelToPascal(shortest.name);
      let name = base;
      let suffix = 1;

      while (usedNames.has(name)) {
        name = `${base}${++suffix}`;
      }

      usedNames.add(name);

      aliases.push({
        name,
        source: `type ${name} = ${
          renderUnion([
            ...alias.values.map(v => `'${v}'`),
            'Value'
          ])
        };`
      });

      for (const consumer of consumers) {
        consumer.aliases ??= [];
        consumer.aliases.push(name);

        consumer.values = consumer.values.filter(v =>
          !alias.values.includes(v)
        );
      }

      extracted = true;
    }

    if (!extracted) {
      break;
    }
  }

  return aliases.sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Extract keyword values from a CSS syntax definition
 */
export function extractKeywords(
  syntax: string | undefined,
  types: Record<string, { syntax?: string }>,
  visited: Set<string> = new Set()
): string[] {
  if (syntax === undefined) {
    return [];
  }

  const keywords = new Set<string>();
  const ast = definitionSyntax.parse(syntax);

  definitionSyntax.walk(ast, (node) => {
    if (node.type === 'Keyword' && node.name !== undefined) {
      keywords.add(node.name);
    }

    if (
      node.type === 'Type'
      && node.name !== undefined
      && !visited.has(node.name)
    ) {
      visited.add(node.name);

      for (
        const keyword of extractKeywords(
          types[node.name]?.syntax,
          types,
          visited
        )
      ) {
        keywords.add(keyword);
      }
    }
  });

  return [...keywords].sort();
}

/**
 * Render CSS property and value types
 */
async function renderTypes(): Promise<string> {
  const { properties, types = {} } = await css.index();

  const props: Property[] = Object.values(properties).map(p => ({
    name: kebabToCamel(p.name),
    values: extractKeywords(p.syntax, types).filter(k =>
      !(SHARED as readonly string[]).includes(k)
    )
  }));

  const aliases = extractAliases(props);

  const declarations = props
    .map(prop => {
      const names = prop.aliases ?? [];
      names.push(...prop.values.map(v => `'${v}'`));

      if ((prop.aliases ?? []).length === 0) {
        names.push('Value');
      }

      return `  ${prop.name}?: ${renderUnion(names)};`;
    })
    .sort();

  return `// This file is managed by the generate-types script.

import type { AuthorValue } from './values.ts';

type Value = AuthorValue | ${renderUnion(SHARED.map(k => `'${k}'`))};

${aliases.map(a => a.source).join('\n')}

export type KnownProperties = {
${declarations.join('\n')}
};
`;
}

/**
 * Generate CSS property and value types
 */
async function generate(): Promise<void> {
  await writeFile(TYPES, await renderTypes());
}

const entrypoint = process.argv[1];

if (
  entrypoint !== undefined
  && pathToFileURL(resolve(entrypoint)).href === import.meta.url
) {
  await generate();
}
