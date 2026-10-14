import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';

import {
  component,
  type ComponentFactory,
  type Component
} from '../src/index.ts';
import { extractBuildPlan } from '../src/internal.ts';

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));

/**
 * Compare generated styles with a golden CSS file
 */
export function compareStyles(
  name: string,
  define: (c: ComponentFactory) => Component<any>
): void {
  test(name, async () => {
    const applied = define(component).apply();
    const output = `${extractBuildPlan(applied).compile().trimEnd()}\n`;

    await expect(output).toMatchFileSnapshot(
      join(TESTS_DIR, `${name}.css`)
    );
  });
}
