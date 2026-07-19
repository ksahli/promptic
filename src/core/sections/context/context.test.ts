import { expect, test } from 'vitest';
import fc from 'fast-check';

import { context } from 'promptic/core/sections/context';
import { promptArbitrary } from '../../../testing/prompt.js';

test('appends the given entry to context', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), fc.string(), (base, title, content) => {
      const result = context(title, content)(base);
      expect(result.context).toEqual([...(base.context ?? []), { title, content }]);
    }),
  );
});

test('preserves every other field of the prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), fc.string(), (base, title, content) => {
      const result = context(title, content)(base);
      expect({ ...result, context: undefined }).toEqual({ ...base, context: undefined });
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, fc.string(), fc.string(), (base, title, content) => {
      const snapshot = structuredClone(base);
      context(title, content)(base);
      expect(base).toEqual(snapshot);
    }),
  );
});

test('accumulates entries in order when composed', () => {
  fc.assert(
    fc.property(
      promptArbitrary,
      fc.string(),
      fc.string(),
      fc.string(),
      fc.string(),
      (base, t1, c1, t2, c2) => {
        const result = context(t2, c2)(context(t1, c1)(base));
        expect(result.context).toEqual([
          ...(base.context ?? []),
          { title: t1, content: c1 },
          { title: t2, content: c2 },
        ]);
      },
    ),
  );
});
