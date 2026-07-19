import type { Apply, Prompt } from 'promptic/core/prompt';

/**
 * Sets the prompt's role — the job the model is being asked to perform.
 *
 * Role is a single value, so calling this again replaces any previously set
 * role.
 *
 * @param content - Description of the task or function.
 * @returns An {@link Apply} that sets the role on a prompt.
 */
function role(content: string): Apply {
  return (prompt: Prompt): Prompt => ({
    ...prompt,
    role: content,
  });
}

export { role };
