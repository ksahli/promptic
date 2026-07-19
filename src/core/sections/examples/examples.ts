import type { Apply, Prompt } from 'promptic/core/prompt';

/**
 * Appends a worked human/assistant example demonstrating desired behaviour.
 *
 * Examples accumulate: each call adds another pair to any examples already on
 * the prompt.
 *
 * @param human - The example user turn.
 * @param assistant - The desired assistant response to that turn.
 * @returns An {@link Apply} that appends the example to a prompt.
 */
function examples(human: string, assistant: string): Apply {
  return (prompt: Prompt): Prompt => ({
    ...prompt,
    examples: [...(prompt.examples ?? []), { human, assistant }],
  });
}

export { examples };
