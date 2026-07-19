import { expect, test } from 'vitest';
import fc from 'fast-check';

import { rules } from 'promptic/core/sections/rules';
import { promptArbitrary } from '../../../testing/prompt.js';

test('appends the given rules in order', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), (base, added) => {
      const result = rules(...added)(base);
      expect(result.rules).toEqual([...(base.rules ?? []), ...added]);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), (base, added) => {
      const result = rules(...added)(base);
      expect({ ...result, rules: undefined }).toEqual({ ...base, rules: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), (base, added) => {
      const snapshot = structuredClone(base);
      rules(...added)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('accumulates rules across composition', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), fc.array(fc.string()), (base, a, b) => {
      const result = rules(...b)(rules(...a)(base));
      expect(result.rules).toEqual([...(base.rules ?? []), ...a, ...b]);
    }),
  );
});
