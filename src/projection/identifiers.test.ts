import { assert, describe, it } from 'vitest';

import { defineComponent } from '../components.ts';
import { projectIdentifiers } from './identifiers.ts';

describe('projectIdentifiers', () => {
  it('returns an empty map when no identifiers are defined', () => {
    const component = defineComponent('card');

    assert.deepEqual(projectIdentifiers(component.current), {});
  });

  it('projects string and variable identifiers', () => {
    const component = defineComponent('card').identifiers({
      alfa: 'string',
      bravo: 'variable',
      charlieDelta: 'string'
    });

    assert.deepEqual(projectIdentifiers(component.current), {
      alfa: 'card--alfa',
      bravo: '--card--bravo',
      charlieDelta: 'card--charlie-delta'
    });
  });
});
