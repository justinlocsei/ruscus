/**
 * Project a camelCase style property to a CSS property name
 */
export function asProperty(camelCase: string): string {
  return camelCase.replace(
    /[A-Z]/g,
    letter => `-${letter.toLowerCase()}`
  );
}

/**
 * Reserved slot name for the root of an element with children
 */
export const ELEMENT_ROOT = 'root';

/**
 * Build a BEM class selector from namespace levels
 */
export function buildSelector(levels: readonly string[]): string {
  return `.${levels.join('__')}`;
}
