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
 * Build a BEM class selector from namespace levels
 */
export function buildSelector(levels: readonly string[]): string {
  return `.${levels.join('__')}`;
}
