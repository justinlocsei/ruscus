import type { RuleBlock } from './types.ts';

/**
 * A mapping of labels to queries
 */
type NamedQueries = Record<string, string>;

/**
 * Blocks keyed by query labels
 */
type QueryBlocks<Q extends NamedQueries> = {
  [K in keyof Q]: RuleBlock;
};

/**
 * A provider that supports partial rules and exposes named queries
 */
type QueryProvider<Q extends NamedQueries> =
  & { [K in keyof Q]: Q[K] }
  & ((blocks: Partial<QueryBlocks<Q>>) => RuleBlock);

/**
 * Define a provider of named queries
 */
export function defineQueries<Q extends NamedQueries>(
  queries: Q
): QueryProvider<Q> {
  const build = (blocks: Partial<QueryBlocks<Q>>): RuleBlock => {
    const rules: RuleBlock = {};

    for (const [label, block] of Object.entries(blocks)) {
      const prelude = queries[label];

      if (block === undefined || prelude === undefined) {
        continue;
      }

      rules[prelude] = block;
    }

    return rules;
  };

  return Object.assign(build, queries);
}
