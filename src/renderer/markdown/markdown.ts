import type { Prompt } from 'promptic/core/prompt';

/**
 * Renders a {@link Prompt} as human-readable Markdown.
 *
 * Sections are emitted in the canonical order — identity, role, context, rules,
 * constraints, examples — each under a `##` heading. Absent or empty sections
 * are omitted, and present sections are separated by a single blank line.
 *
 * @param prompt - The prompt to render.
 * @returns The Markdown representation, with no leading or trailing blank lines.
 */
function markdown(prompt: Prompt): string {
  const sections: string[] = [];

  if (prompt.identity) {
    sections.push(`## Identity\n\n${prompt.identity}`);
  }

  if (prompt.role) {
    sections.push(`## Role\n\n${prompt.role}`);
  }

  if (prompt.context && prompt.context.length > 0) {
    const blocks = prompt.context.map(({ title, content }) => `### ${title}\n\n${content}`);
    sections.push(`## Context\n\n${blocks.join('\n\n')}`);
  }

  if (prompt.rules && prompt.rules.length > 0) {
    const items = prompt.rules.map((rule) => `- ${rule}`);
    sections.push(`## Rules\n\n${items.join('\n')}`);
  }

  if (prompt.constraints && prompt.constraints.length > 0) {
    const items = prompt.constraints.map((constraint) => `- ${constraint}`);
    sections.push(`## Constraints\n\n${items.join('\n')}`);
  }

  if (prompt.examples && prompt.examples.length > 0) {
    const blocks = prompt.examples.map(
      ({ human, assistant }) => `**Human:** ${human}\n\n**Assistant:** ${assistant}`,
    );
    sections.push(`## Examples\n\n${blocks.join('\n\n')}`);
  }

  return sections.join('\n\n');
}

export { markdown };
