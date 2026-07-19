import fc from 'fast-check';

import type { Prompt } from 'promptic/core/prompt';

/** A fast-check arbitrary generating a valid {@link Prompt} output format. */
const output = fc.constantFrom<Prompt['output']>('markdown', 'markup', 'raw');

/**
 * A fast-check arbitrary generating arbitrary {@link Prompt} values.
 *
 * Only `output` is required; every other section is present or absent at
 * random, giving property-based tests broad coverage of prompt shapes.
 */
const promptArbitrary: fc.Arbitrary<Prompt> = fc.record(
  {
    output,
    identity: fc.string(),
    role: fc.string(),
    context: fc.array(fc.record({ title: fc.string(), content: fc.string() })),
    rules: fc.array(fc.string()),
    constraints: fc.array(fc.string()),
    examples: fc.array(fc.record({ human: fc.string(), assistant: fc.string() })),
  },
  { requiredKeys: ['output'] },
);

export { output, promptArbitrary };
