import { expect, test } from 'vitest';
import fc from 'fast-check';

import { render } from 'promptic/renderer/render';
import { markdown } from 'promptic/renderer/markdown';
import { markup } from 'promptic/renderer/markup';
import { raw } from 'promptic/renderer/raw';
import { promptArbitrary } from '../../testing/prompt.js';

const formats = { markdown, markup, raw };

test('delegates to the renderer for the prompt output format', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      expect(render(prompt)).toBe(formats[prompt.output](prompt));
    }),
  );
});

test('is deterministic', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      expect(render(prompt)).toBe(render(prompt));
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      const snapshot = structuredClone(prompt);
      render(prompt);
      expect(prompt).toEqual(snapshot);
    }),
  );
});

test('always returns a string', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      expect(typeof render(prompt)).toBe('string');
    }),
  );
});
