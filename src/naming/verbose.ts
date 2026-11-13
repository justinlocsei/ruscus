import { Naming } from './shared.ts';

export class VerboseNaming extends Naming {
  /**
   * Produce a BEM-style class name
   */
  forClass(levels: string[]): string {
    return this.project(levels.join('__'));
  }
}
