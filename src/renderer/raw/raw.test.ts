import { expect, test } from 'vitest';
import fc from 'fast-check';

import type { Prompt } from 'promptic/core/prompt';
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

// A non-empty, lowercase token free of newlines, so it can never collide with an
// uppercase section label or introduce blank-line runs.
const token = fc.string({ minLength: 1 }).map((s) => s.replaceAll('\n', ' ').toLowerCase());

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
    fc.property(arbitrary, (prompt) => {
      expect(raw(prompt)).toBe(raw(prompt));
    }),
  );
});

test('does not mutate the input prompt', () => {
  fc.assert(
    fc.property(arbitrary, (prompt) => {
      const snapshot = structuredClone(prompt);
      raw(prompt);
      expect(prompt).toEqual(snapshot);
    }),
  );
});

test('renders a prompt with no sections as the empty string', () => {
  fc.assert(
    fc.property(output, (value) => {
      expect(raw({ output: value })).toBe('');
    }),
  );
});

test('omits sections that are empty', () => {
  fc.assert(
    fc.property(output, (value) => {
      const rendered = raw({
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

test('emits every label in canonical order', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = raw(prompt);
      const order = ['IDENTITY', 'ROLE', 'CONTEXT', 'RULES', 'CONSTRAINTS', 'EXAMPLES'];
      const positions = order.map((label) => rendered.indexOf(label));
      expect(positions.every((position) => position >= 0)).toBe(true);
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    }),
  );
});

test('includes the content of every section', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = raw(prompt);
      expect(rendered).toContain(prompt.identity);
      expect(rendered).toContain(prompt.role);
      for (const { title, content } of prompt.context) {
        expect(rendered).toContain(title);
        expect(rendered).toContain(content);
      }
      for (const rule of prompt.rules) expect(rendered).toContain(rule);
      for (const constraint of prompt.constraints) expect(rendered).toContain(constraint);
      for (const { human, assistant } of prompt.examples) {
        expect(rendered).toContain(human);
        expect(rendered).toContain(assistant);
      }
    }),
  );
});

test('has no leading or trailing blank lines and no blank-line runs', () => {
  fc.assert(
    fc.property(fullPrompt, (prompt) => {
      const rendered = raw(prompt);
      expect(rendered).not.toMatch(/^\n/);
      expect(rendered).not.toMatch(/\n$/);
      expect(rendered).not.toContain('\n\n\n');
    }),
  );
});
