# Ruscus

Zero-runtime TypeScript library for orchestrating component styles: a component's elements and variants are defined as a typed tree that projects into class names, while the CSS itself is bring-your-own. Library source is `src/`.

Published entrypoints: **`ruscus`** (`src/index.ts`) for authoring and view-layer projection, and **`ruscus/vite`** (`src/plugins/vite.ts`) for bundler integration. Programmatic `compile` / `styleComponents` is **not** part of the public package API — CSS emission for apps goes through the Vite plugin and the build plan attached at `.apply()`.

## Public API (`src/index.ts`)

Author-facing symbols are documented in [README.md](README.md). Do not treat these as removable unless the README and changelog are updated together.

| Export | Role |
| --- | --- |
| `component` | Component builder → `.apply()` class-name tree |
| `configure` | Global naming/config singleton (Vite injects matching config in dev/build via `virtual:ruscus/config`) |
| `identifiers` | **`identifiers(appliedComponent)`** — projected values for `.identifiers()` types (string IDs and CSS custom property names) for use in JSX; see README **Identifiers** |
| `queries` | Labeled at-rules for `.global` providers |
| `css` | Ergonomic `Styles` object helper |
| `trait` | Reusable relative fragments; `Trait` type |
| `CSS`, `KnownProperty`, `PropertyName` | Author and string-level CSS typing |
| `VariantsFor` | Extract variant name unions from applied specs |
| `NestedStyles`, `StyleFragment`, `StyleFragmentBuilder` | Types for dynamic trait/helpers |

`identifiers` is implemented in `src/internal.ts` (`extractIdentifiers`) but is **intentionally public** — not an internal-only helper.

## Traits and fragments

| Mechanism | Where | Behavior |
| --- | --- | --- |
| `trait()` / `defineTrait` | `src/traits.ts` | Builds a `Trait` (`Fragment<'relative'>`) |
| `component().is()` / `element().is()` | `src/components.ts`, `src/elements.ts` | `mergeTraits` merges roots onto base styles; trait **nested** maps become **nested providers** on the definition |
| `s().is()` on fragments | `src/fragments.ts` | Eager merge via `mergeTraitStyles` + `mergeFragmentStyles`; used in `.variants`, `.nested`, `.global` providers |
| Nested collision | `mergeFragmentStyles` in `src/fragments.ts` | Same selector key merges **recursively** (roots via `mergeStyles`, nested maps walked); later wins on duplicate properties at each level |
| Module graph | `traits.ts` → `fragments.ts` → `types/fragments.ts` | No import cycle; fragment `Fragment.is` is typed with `Fragment<'relative'>[]`, not `Trait` in `types/fragments.ts` |

Integration coverage: `tests/traits.test.ts` (golden `traits.css`); unit tests in `src/fragments.test.ts`, `src/traits.test.ts`.

## Type architecture

**Author-facing code** (component/element builders, `.apply()`, nested/global/variant style providers) should get **maximum precision**: preserve the fluent spec `S` (`els`, `variants`, `ids`) and project it into types. Do not widen to `Any*` at these boundaries unless there is a deliberate escape hatch.

**Internal code** (definitions on disk, compile walks, stored providers) should get **maximum flexibility**: homogenous shapes and erasure so generics do not need to flow through the whole pipeline.

| Layer | Role | Typing |
| --- | --- | --- |
| Builder / `.apply()` | TSX class names, narrow inference | `Component<S>`, `InternalComponent<S>`, `ProjectedComponent<S>` (`src/types/components.ts`) |
| Style providers on the builder | Fragment keys, `els`, `variants()` | `DerivedComponentContext<S>`, `DerivedElementContext<S>`, `DerivedComponentStyles`, `DerivedElementStyles` |
| `ComponentDefinition` / `ElementDefinition` | Stored tree + provider lists | Wide `DerivedComponentContext` / `DerivedElementContext` (erased at storage) |
| `ComponentCompiler` | Emit CSS from definitions | `buildSelector`; fragment map **keys are strings** at compile time (authors call `els.*()` when a node is a projector) |
| Context builders | CSS selector `els` for derived styles | `buildComponentContext` / `buildElementContext` in `src/contexts.ts`; both call `projectElementTree` with `format: 'selectors'` and `hasVariants` from `component.variants` / `element.variants` |

**Projection types** (`ProjectElement`, `ProjectedElement`, `ProjectedElements`, `ProjectedTree`) live in `src/types/elements.ts`. `ProjectedTree<S, E>` is `{ root: ProjectElement<S> } & ProjectedElements<E>` for component/element roots and child maps (`ProjectedComponent`, derived `els`, wide selector projection). Apply uses `projectComponent` (`format: 'names'`); compile contexts use selector formatting only—same TypeScript tree shape.

**Variant projectors:** For a given node, types are **either** a plain `string` **or** `VariantProjector<V>` (conditional on `variants: never`), not `string | VariantProjector` on the same property. Authors with variants call `els.foo()` / `root()` in fragment keys; plain `els.foo` when the spec has no variants on that node. **`context.variants`** (`projectVariantSelector('&')`) is for relative `&.is-*` keys; **`els.*()`** yields absolute class/selector strings (e.g. `.card.is-compact`). Avoid helper bridges that accept both string and projector on one property.

**Wide spec defaults** (`ComponentSpec`, `ElementSpec`) are for **storage and internal provider signatures**, not for typing a normal `.apply()` result. Their defaults use `variants: string`, open elements/children, and open identifiers. `EmptyComponentSpec` / `EmptyElementSpec` are used only by `defineComponent` / `defineElement` to start the builder chain; the classes themselves default to the wide specs. A bare `ComponentSpec` passed to `ProjectedComponent` over-types the root as always callable—fine for wide bounds, wrong for author ergonomics. Prefer the narrowed `S` from the builder chain for applied types.

**Provider variance:** Stored providers use wide `DerivedComponentContext` / `DerivedElementContext`. Cast narrow author providers to these erased types when pushing onto component or element definitions.

**Generics:** Let `S` accrue on the fluent chain; do not thread `S` through compile/storage unless author precision truly requires it. That split is intentional complexity tradeoff: slightly awkward internal casts and wide-spec erasure vs. a fully generic compiler.

**CSS types:**

- **Layout:** `src/types/css/values.ts` (`AuthorValue` with `AuthorString` for literal hints, wide `Value` for erasure) and generated `src/types/css/properties.ts`, composed in `src/types/css.ts`.
- **Author `Styles`:** `KnownProperties & Record<string, Value | undefined>` — autocomplete on known keys and keywords without rejecting arbitrary properties or values.
- **`Declarations`:** wide `[property: string]: Value | undefined`; compile paths do not use generated keyword unions.
- **Codegen:** `scripts/generate-css-types.ts` (`npm run generate:types`, Node `--experimental-strip-types`); `@webref/css` (shim in `scripts/webref-css.d.ts`) plus CSSTree `definitionSyntax` (`@types/css-tree`). **`KnownProperties`** and **`PropertyName`** are exported from the generated file (`PropertyName` is a type-only kebab-case string union, not derived from keys at check time). Shared keyword sets become non-exported PascalCase aliases (shortest camel property name, numeric suffix on clashes), extracted iteratively by overlapping value sets (`MIN_VALUE_OVERLAP` in the script). Each property type uses aliases, remaining literals, and/or a file-local `Value` (`AuthorValue |` wide keywords). The extractor mutates in-memory prop `values` between passes while generating.
- **Naming:** generated property keys are camelCase (`kebabToCamel` in the script); emit uses `camelToKebab` / `PropertyProjector`.
- **Formatting:** `properties.ts` is dprint-excluded so each property and union stays one line for diff readability.
- **Non-goals:** generated types improve DX only; they are not a strict CSS validator or csstype-level enforcement.

## Exports

**Package contract:** only symbols exported from `src/index.ts` and `src/plugins/vite.ts` (built to `dist/*.mjs` / `*.d.mts`) are public. The Vite plugin is the supported app integration path.

**Within the repo**, keep helpers module-local until another `src/` module or the public index needs them. Do not add preemptive `index.ts` exports. When a symbol already belongs in `src/index.ts`, **export the existing definition** from its home module (often `src/types/`) instead of duplicating types.

`src/compilation.ts`, `mergeFragmentStyles`, `extractBuildPlan`, and most of `src/internal.ts` are **internal** — except `identifiers`, which is re-exported from `internal.ts` as part of the public API.

## Dev commands

Before finishing work:

```sh
npm run check
npm run test
npm run test:coverage
```

After changing `scripts/generate-css-types.ts` or bumping `@webref/css`, run `npm run generate:types` and commit the updated `src/types/css/properties.ts`.

## Changelog

When adding a release section to `CHANGELOG.md`, use the **verbatim** subject line of each merged PR commit on `main` since the previous tag (for example `Link to Portflorio (#25)`), without rewording. Drop the trailing `(#NN)` from the bullet text and add a `[#NN]` reference link in the footer, following existing entries. Group bullets under Features, Changes, Fixes, or Development as in [RELEASING.md](RELEASING.md).

## Vite integration

The `ruscus/vite` plugin extracts CSS from graph-reachable style modules whose
default export is an applied component. Style modules must match the configured
file extension (default `.styles.ts`). Importing a style module from
application code makes its CSS available in development and production; unused
style modules produce no CSS. Component IDs must be unique among reachable
modules. Plugin options: `extension` (default `.styles.ts`); `naming` defaults
to verbose during `vite dev` and compact during `vite build`.
The Vite plugin implementation is under `src/plugins/vite/`, with integration
tests under `tests/plugins/vite/`. It injects a `virtual:ruscus/config`
module that calls `configure()` so `.apply()` and compiled CSS share the
same global config; it does not rewrite style source beyond added imports.

## Testing

Unit tests live beside source as `src/**/*.test.ts`. Integration tests live under `tests/` (golden CSS via `compareStyles` in `tests/helpers.ts`). After editing a source file, run its matching test file when one exists. Coverage: `npm run test:coverage` (100% thresholds on core `src/`; see `vitest.config.ts`; excludes `src/plugins/**`, `src/tests.ts`, and `src/tests/**`).

Property tests use `*.prop.test.ts` with `fast-check` for randomized invariants in the style, fragment, naming, and compilation core. Set `RUSCUS_PROP_TEST_RUNS` or `RUSCUS_PROP_TEST_SEED` to reproduce or expand a run; these tests complement rather than replace example and golden tests.

Use **NATO phonetic** names for sequential test data (`alfa`, `bravo`, `charlie`, …) instead of `foo` / `test1` / `a`, `b`.

## Code style

- Strict TypeScript; `.ts` import extensions
- **Biome** (lint + import organize) and **dprint** (format)
- `import type` for type-only imports
- **Alphabetical order** when adding new code: tests (including `describe` blocks), types, keys in plain object literals, members in specs and typed maps, and top-level functions or methods in a module (unless a different order is intentional, e.g. a fluent chain). Preserve the existing order of code when modifying a module.
- Keep initialisms uppercase in TypeScript identifiers: use `ID`, not `Id`.
- Comments only for non-obvious logic; minimize scope; match existing patterns
- Do not reword existing code comments — leave their wording unchanged unless the underlying behavior changed and the comment is no longer accurate

## Library internals

Published `dist/` contains `index.mjs`, `index.d.mts`, `vite.mjs`, and `vite.d.mts` (no source maps or shared chunks in the tarball). `tsdown` builds each entry separately with `codeSplitting: false` so bundles stay self-contained.
