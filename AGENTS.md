# Ruscus

Zero-runtime TypeScript library for orchestrating component styles: a component's elements and variants are defined as a typed tree that projects into class names, while the CSS itself is bring-your-own. Library source is `src/`.

Public API: `src/index.ts` (component factory, compile entry, queries).

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
- **Codegen:** `scripts/generate-css-types.mjs` (`npm run generate:types`); `@webref/css` plus CSSTree `definitionSyntax`. Only **`KnownProperties`** is exported from the generated file. Shared keyword sets become non-exported PascalCase aliases (shortest camel property name, numeric suffix on clashes), extracted iteratively by overlapping value sets (`MIN_VALUE_OVERLAP` in the script). Each property type uses aliases, remaining literals, and/or a file-local `Value` (`AuthorValue |` wide keywords). The extractor mutates in-memory prop `values` between passes while generating.
- **Naming:** generated property keys are camelCase (`kebabToCamel` in the script); emit uses `camelToKebab` / `PropertyProjector`.
- **Formatting:** `properties.ts` is dprint-excluded so each property and union stays one line for diff readability.
- **Non-goals:** generated types improve DX only; they are not a strict CSS validator or csstype-level enforcement.

## Exports

Be conservative about what gets exported. Only export a type or function when another module in this repo genuinely needs it, or when explicitly requested as part of the public API in `src/index.ts`. Do not preemptively export helpers, types, or utilities “just in case” — keep symbols module-local until there is a concrete internal consumer or an intentional API decision.

When that consumer appears, **export the existing type** from its home module (often `src/types/`) instead of copying an equivalent alias elsewhere. Prefer widening visibility of one shared definition over duplicating constraints like `NamedElements` under a new name in runtime modules.

## Dev commands

Before finishing work:

```sh
npm run check
npm run test
```

After changing `scripts/generate-css-types.mjs` or bumping `@webref/css`, run `npm run generate:types` and commit the updated `src/types/css/properties.ts`.

## Testing

Unit tests live beside source as `src/**/*.test.ts`. Integration tests live under `tests/` (golden CSS via `compareStyles` in `tests/helpers.ts`). After editing a source file, run its matching test file when one exists.

## Code style

- Strict TypeScript; `.ts` import extensions
- **Biome** (lint + import organize) and **dprint** (format)
- `import type` for type-only imports
- **Alphabetical order** when adding new code: tests (including `describe` blocks), types, keys in plain object literals, members in specs and typed maps, and top-level functions or methods in a module (unless a different order is intentional, e.g. a fluent chain). Preserve the existing order of code when modifying a module.
- Keep initialisms uppercase in TypeScript identifiers: use `ID`, not `Id`.
- Comments only for non-obvious logic; minimize scope; match existing patterns
- Do not reword existing code comments — leave their wording unchanged unless the underlying behavior changed and the comment is no longer accurate

## Testing conventions

- Use **NATO phonetic** names for sequential test data (`alfa`, `bravo`, `charlie`, …) instead of `foo` / `test1` / `a`, `b`

## Library internals

Published `dist/` contains only `index.mjs` and `index.d.mts` (no source maps in the tarball).
