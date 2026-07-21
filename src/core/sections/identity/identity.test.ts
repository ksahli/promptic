import { expect, test } from 'vitest';
import fc from 'fast-check';

import type { Prompt } from 'promptic/core/prompt';
import { identity } from 'promptic/core/sections/identity';

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

test('sets identity to the given content for any prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), (base, content) => {
      const apply = identity(content)
      const result = apply(base)
      expect(result.identity).toBe(content);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), (base, content) => {
      const apply = identity(content);
      const result = apply(base);
      expect({ ...result, identity: undefined }).toEqual({ ...base, identity: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), (base, content) => {
      const snapshot = structuredClone(base);
      identity(content)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('last write wins when composed', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), fc.string(), (base, a, b) => {
      expect(identity(b)(identity(a)(base)).identity).toBe(b);
    }),
  );
});
