import { expect, test } from 'vitest';
import fc from 'fast-check';

import { markup } from 'promptic/renderer/markup';
import { output, promptArbitrary } from '../../testing/prompt.js';

// A non-empty token free of newlines, so it never introduces blank-line runs.
const token = fc.string({ minLength: 1 }).map((s) => s.replaceAll('\n', ' '));

// A prompt with every section present and non-empty.
const fullPrompt = fc.record({
  output,
  identity: token,
  role: token,
  context: fc.array(fc.record({ title: token, content: token }), { minLength: 1 }),
  rules: fc.array(token, { minLength: 1 }),
  constraints: fc.array(token, { minLength: 1 }),
  examples: fc.array(fc.record({ human: token, assistant: token }), { minLength: 1 }),
});

const occurrences = (haystack: string, needle: string): number => haystack.split(needle).length - 1;

test('is deterministic', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      expect(markup(prompt)).toBe(markup(prompt));
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      const snapshot = structuredClone(prompt);
      markup(prompt);
      expect(prompt).toEqual(snapshot);
    }),
  );
});

test('renders a prompt with no sections as the empty string', () => {
  fc.assert(
    fc.property(output, (value) => {
      expect(markup({ output: value })).toBe('');
    }),
  );
});

test('omits sections that are empty', () => {
  fc.assert(
    fc.property(output, (value) => {
      const rendered = markup({
        output: value,
        identity: '',
        role: '',
        context: [],
        rules: [],
        constraints: [],
        examples: [],
      });
      expect(rendered).toBe('');
    }),
  );
});

test('opens the section elements in canonical order', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = markup(prompt);
      const order = ['<identity>', '<role>', '<context>', '<rules>', '<constraints>', '<examples>'];
      const positions = order.map((tag) => rendered.indexOf(tag));
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    }),
  );
});

test('closes every element it opens', () => {
  const names = [
    'identity',
    'role',
    'context',
    'block',
    'title',
    'rules',
    'rule',
    'constraints',
    'constraint',
    'examples',
    'example',
    'human',
    'assistant',
  ];
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = markup(prompt);
      for (const name of names) {
        expect(occurrences(rendered, `<${name}>`)).toBe(occurrences(rendered, `</${name}>`));
      }
    }),
  );
});

test('escapes markup metacharacters in content', () => {
  fc.assert(
    fc.property(token, (identity) => {
      const escaped = identity
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
      expect(markup({ output: 'markup', identity })).toBe(`<identity>\n${escaped}\n</identity>`);
    }),
  );
});

test('escapes ampersands without double-escaping', () => {
  expect(markup({ output: 'markup', identity: 'a < b & c > d' })).toBe(
    '<identity>\na &lt; b &amp; c &gt; d\n</identity>',
  );
});

test('has no leading or trailing blank lines and no blank-line runs', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = markup(prompt);
      expect(rendered).not.toMatch(/^\n/);
      expect(rendered).not.toMatch(/\n$/);
      expect(rendered).not.toContain('\n\n\n');
    }),
  );
});
