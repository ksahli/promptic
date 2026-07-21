import { expect, test } from 'vitest';
import fc from 'fast-check';

import type { Prompt } from 'promptic/core/prompt';
import { constraints } from 'promptic/core/sections/constraints';

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

test('appends the given constraints in order', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), (base, added) => {
      const apply = constraints(...added)
      const result = apply(base);
      expect(result.constraints).toEqual([...(base.constraints ?? []), ...added]);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), (base, added) => {
      const apply =constraints(...added)
      const result = apply(base);
      expect({ ...result, constraints: undefined }).toEqual({ ...base, constraints: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), (base, added) => {
      const snapshot = structuredClone(base);
      const apply = constraints(...added);
      apply(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('accumulates constraints across composition', () => {
  fc.assert(
    fc.property(arbitrary, fc.array(fc.string()), fc.array(fc.string()), (base, a, b) => {
      const result = constraints(...b)(constraints(...a)(base));
      expect(result.constraints).toEqual([...(base.constraints ?? []), ...a, ...b]);
    }),
  );
});
