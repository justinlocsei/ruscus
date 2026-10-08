# Ruscus

Zero-runtime TypeScript library for orchestrating component styles: a component's elements and variants are defined as a typed tree that projects into class names, while the CSS itself is bring-your-own. Library source is `src/`.

Public API: `src/index.ts`.  It is intentionally empty while the source tree is being scaffolded.

## Exports

Be conservative about what gets exported. Only export a type or function when another module in this repo genuinely needs it, or when explicitly requested as part of the public API in `src/index.ts`. Do not preemptively export helpers, types, or utilities “just in case” — keep symbols module-local until there is a concrete internal consumer or an intentional API decision.

## Dev commands

Before finishing work:

```sh
npm run check
npm run test
```

## Testing

Tests live beside source as `src/**/*.test.ts`. After editing a source file, run its matching test file when one exists.

## Code style

- Strict TypeScript; `.ts` import extensions
- **Biome** (lint + import organize) and **dprint** (format)
- `import type` for type-only imports
- **Alphabetical order** when adding new code: keys in plain object literals, members in specs and typed maps, and top-level functions or methods in a module (unless a different order is intentional, e.g. a fluent chain)
- Comments only for non-obvious logic; minimize scope; match existing patterns
- Do not reword existing code comments — leave their wording unchanged unless the underlying behavior changed and the comment is no longer accurate

## Testing conventions

- Use **NATO phonetic** names for sequential test data (`alfa`, `bravo`, `charlie`, …) instead of `foo` / `test1` / `a`, `b`

## Library internals

Published `dist/` contains only `index.mjs` and `index.d.mts` (no source maps in the tarball).
