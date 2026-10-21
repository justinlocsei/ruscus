import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import css from '@webref/css';
import { definitionSyntax } from 'css-tree';

// The file that will receive the generated types
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
];

// The minimum percentage of overlapping values to produce an alias
const MIN_VALUE_OVERLAP = 0.75;

/**
 * Convert a kebab-cased value to camel case
 *
 * @param {string} kebab
 * @returns {string}
 */
function kebabToCamel(kebab) {
  return kebab.replace(
    /-([a-z])/g,
    (_, letter) => letter.toUpperCase()
  );
}

/**
 * Convert a camel-cased value to Pascal case
 *
 * @param {string} camel
 * @returns {string}
 */
function camelToPascal(camel) {
  return camel[0].toUpperCase() + camel.slice(1);
}

/**
 * Render a union of values as a string
 *
 * @param {string[]} values
 * @returns {string}
 */
function renderUnion(values) {
  return values.join(' | ');
}

/**
 * Calculate the percentage of overlap between two arrays of values
 *
 * @param {string[]} left
 * @param {string[]} right
 * @returns {number}
 */
function calculateOverlap(left, right) {
  const rightValues = new Set(right);
  const shared = left.filter(v => rightValues.has(v));

  return shared.length / Math.max(left.length, right.length);
}

/**
 * Find aliases in a list of properties
 *
 * This iteratively looks for properties that have a high percentage of
 * overlapping values and extracts each set of common values to an alias.
 *
 * @param {object[]} props
 * @returns {object[]}
 */
function findAliases(props) {
  const groups = new Map();
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
        (previous, p) => [
          ...new Set(previous).intersection(new Set(p.values))
        ],
        matching[0].values
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

  return [...groups.values()]
    .sort((l, r) =>
      r.values.length - l.values.length
      || l.values[0].localeCompare(r.values[0])
    );
}

/**
 * Extract aliases from a list of properties
 *
 * @param {object[]} props
 * @returns {object[]}
 */
function extractAliases(props) {
  const aliases = [];

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
        (l, r) =>
          l.name.length - r.name.length
          || l.name.localeCompare(r.name)
      )[0];

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

  return aliases.sort((l, r) => l.name.localeCompare(r.name));
}

/**
 * Extract keywords from a CSS syntax definition
 *
 * @param {string} syntax
 * @param {Record<string, any>} types
 * @param {Set<string>} visited
 * @returns {string[]}
 */
export function extractKeywords(
  syntax,
  types,
  visited = new Set()
) {
  if (syntax === undefined) {
    return [];
  }

  const keywords = new Set();
  const ast = definitionSyntax.parse(syntax);

  definitionSyntax.walk(ast, node => {
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
 * Render CSS property types
 */
async function renderTypes() {
  const { properties, types = {} } = await css.index();

  const props = Object.values(properties).map(p => ({
    name: kebabToCamel(p.name),
    values: extractKeywords(p.syntax, types).filter(k => !SHARED.includes(k))
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
 * Generate CSS property types
 */
async function generate() {
  await writeFile(TYPES, await renderTypes());
}

const entrypoint = process.argv[1];

if (
  entrypoint !== undefined
  && pathToFileURL(resolve(entrypoint)).href === import.meta.url
) {
  await generate();
}
