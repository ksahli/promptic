import type { Prompt } from 'promptic/core/prompt';

/**
 * Renders a {@link Prompt} as plain text with uppercase section labels.
 *
 * Sections are emitted in the canonical order — identity, role, context, rules,
 * constraints, examples — each introduced by an uppercase label on its own line.
 * Absent or empty sections are omitted, and present sections are separated by a
 * single blank line.
 *
 * @param prompt - The prompt to render.
 * @returns The plain-text representation, with no leading or trailing blank lines.
 */
function raw(prompt: Prompt): string {
  const sections: string[] = [];

  if (prompt.identity) {
    sections.push(`IDENTITY\n${prompt.identity}`);
  }

  if (prompt.role) {
    sections.push(`ROLE\n${prompt.role}`);
  }

  if (prompt.context && prompt.context.length > 0) {
    const blocks = prompt.context.map(({ title, content }) => `${title}\n${content}`);
    sections.push(`CONTEXT\n${blocks.join('\n\n')}`);
  }

  if (prompt.rules && prompt.rules.length > 0) {
    sections.push(`RULES\n${prompt.rules.join('\n')}`);
  }

  if (prompt.constraints && prompt.constraints.length > 0) {
    sections.push(`CONSTRAINTS\n${prompt.constraints.join('\n')}`);
  }

  if (prompt.examples && prompt.examples.length > 0) {
    const blocks = prompt.examples.map(({ human, assistant }) => `${human}\n${assistant}`);
    sections.push(`EXAMPLES\n${blocks.join('\n\n')}`);
  }

  return sections.join('\n\n');
}

export { raw };
