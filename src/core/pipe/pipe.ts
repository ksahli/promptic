import type { Apply, Prompt } from 'promptic/core/prompt';

/**
 * Builds a prompt by applying a sequence of transformations left to right.
 *
 * Starting from `initial`, each {@link Apply} receives the result of the
 * previous one, so sections accumulate in call order.
 *
 * @param initial - The base prompt to start from (e.g. `markdown`).
 * @param fns - Section transformers to apply in order.
 * @returns The fully composed prompt.
 *
 * @example
 * ```ts
 * pipe(markdown, identity('a helpful bot'), rules('be concise'));
 * ```
 */
function pipe(initial: Prompt, ...fns: Apply[]): Prompt {
  return fns.reduce((current, next) => next(current), initial);
}

export { pipe };
