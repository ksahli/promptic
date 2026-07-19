import { expect, test } from 'vitest';
import fc from 'fast-check';

import { constraints } from 'promptic/core/sections/constraints';
import { promptArbitrary } from '../../../testing/prompt.js';

test('appends the given constraints in order', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), (base, added) => {
      const result = constraints(...added)(base);
      expect(result.constraints).toEqual([...(base.constraints ?? []), ...added]);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), (base, added) => {
      const result = constraints(...added)(base);
      expect({ ...result, constraints: undefined }).toEqual({ ...base, constraints: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), (base, added) => {
      const snapshot = structuredClone(base);
      constraints(...added)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('accumulates constraints across composition', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.array(fc.string()), fc.array(fc.string()), (base, a, b) => {
      const result = constraints(...b)(constraints(...a)(base));
      expect(result.constraints).toEqual([...(base.constraints ?? []), ...a, ...b]);
    }),
  );
});
