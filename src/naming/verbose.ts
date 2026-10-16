import { Naming } from './shared.ts';

export class VerboseNaming extends Naming {
  /**
   * Generate a BEM-style class name
   */
  generate(levels: string[]): string {
    return levels.join('__');
  }
}
