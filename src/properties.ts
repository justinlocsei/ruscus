/**
 * Project a camelCase style property to a CSS property name
 */
export function asProperty(camelCase: string): string {
  return camelCase.replace(
    /[A-Z]/g,
    letter => `-${letter.toLowerCase()}`
  );
}
