import { expect, test } from 'vitest';
import fc from 'fast-check';

import type { Prompt } from 'promptic/core/prompt';
import { role } from 'promptic/core/sections/role';

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

test('sets role to the given content for any prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), (base, content) => {
      expect(role(content)(base).role).toBe(content);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), (base, content) => {
      const result = role(content)(base);
      expect({ ...result, role: undefined }).toEqual({ ...base, role: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), (base, content) => {
      const snapshot = structuredClone(base);
      role(content)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('last write wins when composed', () => {
  fc.assert(
    fc.property(arbitrary, fc.string(), fc.string(), (base, a, b) => {
      expect(role(b)(role(a)(base)).role).toBe(b);
    }),
  );
});
