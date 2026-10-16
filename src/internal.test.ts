import { assert, describe, it } from 'vitest';

import { defineComponent } from './components.ts';
import {
  annotateComponent,
  extractBuildPlan,
  extractIdentifiers
} from './internal.ts';
import { projectComponent } from './projection.ts';

describe('annotateComponent', () => {
  it('attaches a build plan and identifiers to the projection', () => {
    const component = defineComponent('card').identifiers({ alfa: 'string' });

    const annotated = annotateComponent(projectComponent(component), {
      buildPlan: {
        compile: () => 'compiled',
        component: component.current
      },
      identifiers: { alfa: 'card--alfa' }
    });

    assert.equal(extractBuildPlan(annotated).component, component.current);
    assert.deepEqual(Object.keys(extractIdentifiers(annotated)), ['alfa']);
  });

  it('does not enumerate internal annotations', () => {
    const component = defineComponent('card');
    const projection = projectComponent(component);
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
  it('returns the build plan for an applied component', () => {
    const applied = defineComponent('card').css({ color: 'red' }).apply();
    const buildPlan = extractBuildPlan(applied);

    assert.include(buildPlan.compile(), '.card');
    assert.deepEqual(buildPlan.component.styles, { color: 'red' });
  });
});

describe('extractIdentifiers', () => {
  it('returns projected identifier values', () => {
    const applied = defineComponent('card')
      .identifiers({ alfa: 'string', bravo: 'variable' })
      .apply();

    assert.deepEqual(extractIdentifiers(applied), {
      alfa: 'card--alfa',
      bravo: '--card--bravo'
    });
  });
});
