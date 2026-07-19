import type { Apply, Prompt } from 'promptic/core/prompt';

/**
 * Sets the prompt's identity — who or what the model is.
 *
 * Unlike the list-based sections, identity is a single value, so calling this
 * again replaces any previously set identity.
 *
 * @param content - The persona or self-description.
 * @returns An {@link Apply} that sets the identity on a prompt.
 */
function identity(content: string): Apply {
  return (prompt: Prompt): Prompt => ({
    ...prompt,
    identity: content,
  });
}

export { identity };
