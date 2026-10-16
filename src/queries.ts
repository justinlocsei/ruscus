import { defineAbsoluteFragment } from './fragments.ts';
import type { ScopedFragments } from './types/fragments.ts';

/**
 * Rules keyed by query labels
 */
type AppliedQueries<Q extends NamedQueries> = {
  [K in keyof Q]: QueryRules;
};

/**
 * A mapping of labels to queries
 */
type NamedQueries = Record<string, string>;

/**
 * A function that applies rules to queries
 */
type QueryApplicator<Q extends NamedQueries> = (
  blocks: Partial<AppliedQueries<Q>>
) => QueryRules;

/**
 * A provider that supports partial rules and exposes named queries
 */
type QueryProvider<Q extends NamedQueries> =
  & { [K in keyof Q]: Q[K] }
  & QueryApplicator<Q>;

/**
 * Rules scoped to a query
 */
type QueryRules = ScopedFragments<'absolute'>;

/**
 * Define a provider of named queries
 */
export function defineQueries<Q extends NamedQueries>(
  queries: Q
): QueryProvider<Q> {
  const build: QueryApplicator<Q> = blocks => {
    return Object.entries(blocks).reduce<QueryRules>(
      (previous, [label, rules]) => {
        const query = queries[label];

        if (rules && query) {
          previous[query] = defineAbsoluteFragment().nested(rules);
        }

        return previous;
      },
      {}
    );
  };

  return Object.assign(build, queries);
}
