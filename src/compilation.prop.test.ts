import { fc, test } from '@fast-check/vitest';
import { parse } from 'css-tree';
import { assert } from 'vitest';

import { styleComponent } from './compilation.ts';
import { defineComponent } from './components.ts';

const declaration = fc.dictionary(
  fc.constantFrom('color', 'display', 'margin', 'padding'),
  fc.constantFrom('red', 'block', '0', 'inherit'),
  { maxKeys: 4 }
);

test.prop([
  fc.constantFrom('alfa', 'bravo', 'charlie', 'delta'),
  declaration,
  declaration
])(
  'generated component styles remain parseable CSS',
  (id, root, nested) => {
    const component = defineComponent(id)
      .css(root)
      .nested(s => ({
        '&:hover': s(nested)
      }));

    const output = styleComponent(component.current);

    assert.doesNotThrow(() => parse(output, { context: 'stylesheet' }));
    assert.notInclude(output, 'undefined');
  }
);
