# Ruscus

Ruscus is a zero-runtime, TypeScript-first system for orchestrating component styles.  A component's styled surface area is defined once as a tree of named elements and variants, and that definition projects into a typed set of class names for your view layer.  The CSS itself is yours to write: plain strings or objects, with a small set of opt-in typed values for things like colors and dimensions that cross the CSS/JS boundary.

---

<!-- <toc> -->
- [Status](#status)
- [Development](#development)
- [Why the Name?](#why-the-name)
<!-- </toc> -->

## Status

Ruscus is being built in the open and is not yet usable.  The repository currently contains tooling and an empty public API.

## Development

```sh
npm run check          # Lint, formatting, and type checks
npm run test           # Tests (src/**/*.test.ts)
npm run build          # Build the package to dist/
npm run format         # Format the codebase
```

## Why the Name?

In [floristry](https://www.instagram.com/justinlocsei/), ruscus is a hardy foliage used to give an arrangement its structure.  It rarely draws attention to itself, but everything else is placed in relation to it.
