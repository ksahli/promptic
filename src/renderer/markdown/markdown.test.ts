import { expect, test } from 'vitest';
import fc from 'fast-check';

import { markdown } from 'promptic/renderer/markdown';
import { output, promptArbitrary } from '../../testing/prompt.js';

// A non-empty token free of newlines and '#', so it can never contain a
// Markdown heading marker or introduce blank-line runs of its own.
const token = fc.string({ minLength: 1 }).map((s) => s.replaceAll('\n', ' ').replaceAll('#', ' '));

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

test('is deterministic', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      expect(markdown(prompt)).toBe(markdown(prompt));
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(promptArbitrary, (prompt) => {
      const snapshot = structuredClone(prompt);
      markdown(prompt);
      expect(prompt).toEqual(snapshot);
    }),
  );
});

test('renders a prompt with no sections as the empty string', () => {
  fc.assert(
    fc.property(output, (value) => {
      expect(markdown({ output: value })).toBe('');
    }),
  );
});

test('omits sections that are empty', () => {
  fc.assert(
    fc.property(output, (value) => {
      const rendered = markdown({
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

test('emits every heading in canonical order', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = markdown(prompt);
      const order = [
        '## Identity',
        '## Role',
        '## Context',
        '## Rules',
        '## Constraints',
        '## Examples',
      ];
      const positions = order.map((heading) => rendered.indexOf(heading));
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    }),
  );
});

test('includes the content of every section', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = markdown(prompt);
      expect(rendered).toContain(prompt.identity);
      expect(rendered).toContain(prompt.role);
      for (const { title, content } of prompt.context) {
        expect(rendered).toContain(`### ${title}`);
        expect(rendered).toContain(content);
      }
      for (const rule of prompt.rules) expect(rendered).toContain(`- ${rule}`);
      for (const constraint of prompt.constraints) expect(rendered).toContain(`- ${constraint}`);
      for (const { human, assistant } of prompt.examples) {
        expect(rendered).toContain(`**Human:** ${human}`);
        expect(rendered).toContain(`**Assistant:** ${assistant}`);
      }
    }),
  );
});

test('has no leading or trailing blank lines and no blank-line runs', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = markdown(prompt);
      expect(rendered).not.toMatch(/^\n/);
      expect(rendered).not.toMatch(/\n$/);
      expect(rendered).not.toContain('\n\n\n');
    }),
  );
});
