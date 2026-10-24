<p align="center">
  <img src="./assets/logo.svg" width="600" alt="Larkspur">
</p>

<br>

<p align="center">
  Ruscus is a zero-runtime, TypeScript-first system for orchestrating component styles.  A component's styled surface area is defined once as a tree of named elements and variants, and that definition projects into a typed set of class names for your view layer.  The CSS itself is yours to write: plain strings or objects, with a small set of opt-in typed values for things like colors and dimensions that cross the CSS/JS boundary.
</p>

---

<!-- <toc> -->
- [Status](#status)
- [Development](#development)
- [Why the Name?](#why-the-name)
<!-- </toc> -->

## Status

Ruscus is being built in the open. The core component-style API and Vite
integration are experimental.

## Development

```sh
npm run check          # Lint, formatting, and type checks
npm run test           # Tests (src/**/*.test.ts)
npm run build          # Build the package to dist/
npm run format         # Format the codebase
```

## Vite

Add the plugin to serve extracted CSS during development and include it in
production builds:

```typescript
import { defineConfig } from 'vite';
import ruscus from 'ruscus/vite';

export default defineConfig({
  plugins: [ruscus()]
});
```

Import a module that default-exports an applied component from the application
graph. The plugin extracts CSS only for reachable modules, so code splitting and
unused-style elimination follow Vite's module graph. Component IDs must be
unique among reachable modules. CSS uses verbose class names in development and
compact names in production; pass `naming: 'verbose' | 'compact'` to override.

## Why the Name?

In [floristry](https://www.instagram.com/justinlocsei/), ruscus is a hardy foliage used to give an arrangement its structure.  It rarely draws attention to itself, but everything else is placed in relation to it.
