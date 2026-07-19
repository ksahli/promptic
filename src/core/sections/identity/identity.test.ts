import { expect, test } from 'vitest';
import fc from 'fast-check';

import { identity } from 'promptic/core/sections/identity';
import { promptArbitrary } from '../../../testing/prompt.js';

test('sets identity to the given content for any prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), (base, content) => {
      expect(identity(content)(base).identity).toBe(content);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), (base, content) => {
      const result = identity(content)(base);
      expect({ ...result, identity: undefined }).toEqual({ ...base, identity: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), (base, content) => {
      const snapshot = structuredClone(base);
      identity(content)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('last write wins when composed', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), fc.string(), (base, a, b) => {
      expect(identity(b)(identity(a)(base)).identity).toBe(b);
    }),
  );
});
