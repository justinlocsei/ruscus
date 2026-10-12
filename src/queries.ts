import { defineAbsoluteFragment } from './fragments.ts';
import type { GlobalDefinitions } from './types.ts';

/**
 * A mapping of labels to queries
 */
type NamedQueries = Record<string, string>;

/**
 * Global fragments keyed by query labels
 */
type QueryBlocks<Q extends NamedQueries> = {
  [K in keyof Q]: GlobalDefinitions;
};

/**
 * A provider that supports partial rules and exposes named queries
 */
type QueryProvider<Q extends NamedQueries> =
  & { [K in keyof Q]: Q[K] }
  & ((blocks: Partial<QueryBlocks<Q>>) => GlobalDefinitions);

/**
 * Define a provider of named queries
 */
export function defineQueries<Q extends NamedQueries>(
  queries: Q
): QueryProvider<Q> {
  const build = (blocks: Partial<QueryBlocks<Q>>): GlobalDefinitions => {
    const rules: GlobalDefinitions = {};

    for (const [label, defs] of Object.entries(blocks)) {
      const prelude = queries[label as keyof Q];

      if (defs === undefined || prelude === undefined) {
        continue;
      }

      rules[prelude] = wrapQueryBlock(defs);
    }

    return rules;
  };

  return Object.assign(build, queries);
}

/**
 * Wrap global fragments in a query prelude
 */
function wrapQueryBlock(defs: GlobalDefinitions) {
  return defineAbsoluteFragment().nested(defs);
}
