import { expect, test } from 'vitest';
import fc from 'fast-check';

import { examples } from 'promptic/core/sections/examples';
import { promptArbitrary } from '../../../testing/prompt.js';

test('appends the given example to examples', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), fc.string(), (base, human, assistant) => {
      const result = examples(human, assistant)(base);
      expect(result.examples).toEqual([...(base.examples ?? []), { human, assistant }]);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), fc.string(), (base, human, assistant) => {
      const result = examples(human, assistant)(base);
      expect({ ...result, examples: undefined }).toEqual({ ...base, examples: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), fc.string(), (base, human, assistant) => {
      const snapshot = structuredClone(base);
      examples(human, assistant)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('accumulates examples in order when composed', () => {
  fc.assert(
    fc.property(
      promptArbitrary,
      fc.string(),
      fc.string(),
      fc.string(),
      fc.string(),
      (base, h1, a1, h2, a2) => {
        const result = examples(h2, a2)(examples(h1, a1)(base));
        expect(result.examples).toEqual([
          ...(base.examples ?? []),
          { human: h1, assistant: a1 },
          { human: h2, assistant: a2 },
        ]);
      },
    ),
  );
});
