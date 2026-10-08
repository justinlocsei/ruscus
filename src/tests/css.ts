/**
 * Remove the first line's leading whitespace from every line
 */
function dedent(text: string): string {
  const lines = text
    .replace(/^\n/, '')
    .split('\n');

  const margin = lines[0]?.match(/^ */)?.[0]?.length ?? 0;

  return lines
    .map(line => line.slice(margin))
    .join('\n')
    .trim();
}

/**
 * Define compiled CSS output
 */
export function css(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  let text = strings[0] ?? '';

  for (let index = 0; index < values.length; index++) {
    text += String(values[index]) + (strings[index + 1] ?? '');
  }

  return dedent(text);
}
