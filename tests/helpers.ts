import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';

import { defineComponent } from '../src/components.ts';
import { type Component, type ComponentFactory } from '../src/components.ts';
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
    const applied = define(defineComponent).apply();
    const buildPlan = extractBuildPlan(applied);

    if (buildPlan === undefined) {
      throw new Error('Expected the applied component to have a build plan');
    }

    const output = `${buildPlan.compile().trimEnd()}\n`;

    await expect(output).toMatchFileSnapshot(
      join(TESTS_DIR, `${name}.css`)
    );
  });
}
