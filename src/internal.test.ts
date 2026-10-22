import { assert, describe, it } from 'vitest';

import { defineComponent } from './components.ts';
import {
  annotateComponent,
  extractBuildPlan,
  extractIdentifiers
} from './internal.ts';
import { useNaming } from './naming.ts';
import { projectComponent } from './projection.ts';

describe('annotateComponent', () => {
  it('attaches annotations to a projected component', () => {
    const component = defineComponent('card').identifiers({ alfa: 'string' });

    const annotated = annotateComponent(
      projectComponent(component, useNaming(component.current)),
      {
        buildPlan: {
          compile: () => 'compiled',
          component: component.current
        },
        identifiers: { alfa: 'card--alfa' }
      }
    );

    assert.equal(extractBuildPlan(annotated).component, component.current);
    assert.deepEqual(Object.keys(extractIdentifiers(annotated)), ['alfa']);
  });

  it('does not enumerate internal annotations', () => {
    const component = defineComponent('card');

    const projection = projectComponent(
      component,
      useNaming(component.current)
    );

    const keys = Object.keys(projection);

    annotateComponent(projection, {
      buildPlan: {
        compile: () => '',
        component: component.current
      },
      identifiers: {}
    });

    assert.deepEqual(Object.keys(projection), keys);
  });
});

describe('extractBuildPlan', () => {
  it('returns the build plan for an annotated component', () => {
    const applied = defineComponent('card').css({ color: 'red' }).apply();
    const buildPlan = extractBuildPlan(applied);

    assert.include(buildPlan.compile(), '.card');
    assert.deepEqual(buildPlan.component.styles, { color: 'red' });
  });
});

describe('extractIdentifiers', () => {
  it('returns identifier values for an annotated component', () => {
    const applied = defineComponent('card')
      .identifiers({ alfa: 'string', bravo: 'variable' })
      .apply();

    assert.deepEqual(extractIdentifiers(applied), {
      alfa: 'card--alfa',
      bravo: '--card--bravo'
    });
  });
});
