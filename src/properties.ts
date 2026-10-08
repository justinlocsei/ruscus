/**
 * Project a camelCase style property to a CSS declaration name
 */
export function projectProperty(property: string): string {
  return property.replace(
    /[A-Z]/g,
    letter => `-${letter.toLowerCase()}`
  );
}
