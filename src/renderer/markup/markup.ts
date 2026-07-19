import type { Prompt } from 'promptic/core/prompt';

/**
 * Escapes the markup metacharacters `&`, `<`, and `>` as XML entities.
 *
 * `&` is escaped first so the ampersands introduced for `<` and `>` are not
 * double-escaped.
 */
function escape(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Renders a {@link Prompt} as tag-based markup.
 *
 * Sections are emitted in the canonical order — identity, role, context, rules,
 * constraints, examples — each wrapped in its own element. All text content is
 * entity-escaped so the output is always well-formed. Absent or empty sections
 * are omitted, and present sections are separated by a single blank line.
 *
 * @param prompt - The prompt to render.
 * @returns The markup representation, with no leading or trailing blank lines.
 */
function markup(prompt: Prompt): string {
  const sections: string[] = [];

  if (prompt.identity) {
    sections.push(`<identity>\n${escape(prompt.identity)}\n</identity>`);
  }

  if (prompt.role) {
    sections.push(`<role>\n${escape(prompt.role)}\n</role>`);
  }

  if (prompt.context && prompt.context.length > 0) {
    const blocks = prompt.context.map(
      ({ title, content }) =>
        `<block>\n<title>${escape(title)}</title>\n${escape(content)}\n</block>`,
    );
    sections.push(`<context>\n${blocks.join('\n')}\n</context>`);
  }

  if (prompt.rules && prompt.rules.length > 0) {
    const items = prompt.rules.map((rule) => `<rule>${escape(rule)}</rule>`);
    sections.push(`<rules>\n${items.join('\n')}\n</rules>`);
  }

  if (prompt.constraints && prompt.constraints.length > 0) {
    const items = prompt.constraints.map(
      (constraint) => `<constraint>${escape(constraint)}</constraint>`,
    );
    sections.push(`<constraints>\n${items.join('\n')}\n</constraints>`);
  }

  if (prompt.examples && prompt.examples.length > 0) {
    const blocks = prompt.examples.map(
      ({ human, assistant }) =>
        `<example>\n<human>${escape(human)}</human>\n<assistant>${escape(assistant)}</assistant>\n</example>`,
    );
    sections.push(`<examples>\n${blocks.join('\n')}\n</examples>`);
  }

  return sections.join('\n\n');
}

export { markup };
