import type { Apply, Prompt } from 'promptic/core/prompt';

/**
 * Appends one or more constraints — boundaries the model must not cross.
 *
 * Constraints accumulate: each call adds to any constraints already on the
 * prompt.
 *
 * @param constraints - The constraints to append.
 * @returns An {@link Apply} that appends the constraints to a prompt.
 */
function constraints(...constraints: string[]): Apply {
  return (prompt: Prompt): Prompt => ({
    ...prompt,
    constraints: [...(prompt.constraints ?? []), ...constraints],
  });
}

export { constraints };
