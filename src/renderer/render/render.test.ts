import { expect, test } from 'vitest';
import fc from 'fast-check';

import type { Prompt } from 'promptic/core/prompt';
import { render } from 'promptic/renderer/render';
import { markdown } from 'promptic/renderer/markdown';
import { markup } from 'promptic/renderer/markup';
import { raw } from 'promptic/renderer/raw';

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

const formats = { markdown, markup, raw };

test('delegates to the renderer for the prompt output format', () => {
  fc.assert(
    fc.property(arbitrary, (prompt) => {
      expect(render(prompt)).toBe(formats[prompt.output](prompt));
    }),
  );
});

test('is deterministic', () => {
  fc.assert(
    fc.property(arbitrary, (prompt) => {
      expect(render(prompt)).toBe(render(prompt));
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(arbitrary, (prompt) => {
      const snapshot = structuredClone(prompt);
      render(prompt);
      expect(prompt).toEqual(snapshot);
    }),
  );
});

test('always returns a string', () => {
  fc.assert(
    fc.property(arbitrary, (prompt) => {
      expect(typeof render(prompt)).toBe('string');
    }),
  );
});
