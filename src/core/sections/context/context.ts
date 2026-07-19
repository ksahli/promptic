import type { Apply, Prompt } from 'promptic/core/prompt';

/**
 * Appends a titled block of background context for the model to consider.
 *
 * Context blocks accumulate: each call adds another entry to any context
 * already on the prompt.
 *
 * @param title - A short heading identifying the block.
 * @param content - The background information itself.
 * @returns An {@link Apply} that appends the context block to a prompt.
 */
function context(title: string, content: string): Apply {
  return (prompt: Prompt): Prompt => ({
    ...prompt,
    context: [...(prompt.context ?? []), { title, content }],
  });
}

export { context };
