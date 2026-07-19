import type { Apply, Prompt } from 'promptic/core/prompt';

/**
 * Appends one or more rules — positive instructions the model should follow.
 *
 * Rules accumulate: each call adds to any rules already on the prompt.
 *
 * @param rules - The rules to append.
 * @returns An {@link Apply} that appends the rules to a prompt.
 */
function rules(...rules: string[]): Apply {
  return (prompt: Prompt): Prompt => ({
    ...prompt,
    rules: [...(prompt.rules ?? []), ...rules],
  });
}

export { rules };
