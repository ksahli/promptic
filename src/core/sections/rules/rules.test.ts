import { expect, test } from 'vitest';
import fc from 'fast-check';

import type { Prompt } from 'promptic/core/prompt';
import { rules } from 'promptic/core/sections/rules';

const output = fc.constantFrom<Prompt['output']>('markdown', 'markup', 'raw');

const arbitrary: fc.Arbitrary<Prompt> = fc.record(
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

test('appends the given rules in order', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), (base, added) => {
      const result = rules(...added)(base);
      expect(result.rules).toEqual([...(base.rules ?? []), ...added]);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), (base, added) => {
      const result = rules(...added)(base);
      expect({ ...result, rules: undefined }).toEqual({ ...base, rules: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), (base, added) => {
      const snapshot = structuredClone(base);
      rules(...added)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('accumulates rules across composition', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), fc.array(fc.string()), (base, a, b) => {
      const result = rules(...b)(rules(...a)(base));
      expect(result.rules).toEqual([...(base.rules ?? []), ...a, ...b]);
    }),
  );
});
