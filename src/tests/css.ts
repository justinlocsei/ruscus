/**
 * Remove the first line's leading whitespace from every line
 */
function dedent(text: string): string {
  const lines = text
    .replace(/^\n/, '')
    .split('\n');

  const indent = lines[0]?.match(/^ */)?.[0]?.length ?? 0;

  return lines
    .map(l => l.slice(indent))
    .join('\n')
    .trim();
}

/**
 * A template tag that defines flush-left CSS output
 */
export function css(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  let text = strings[0] ?? '';

  for (let i = 0; i < values.length; i++) {
    text += String(values[i]) + (strings[i + 1] ?? '');
  }

  return dedent(text);
}
