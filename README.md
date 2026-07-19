# promptic

A structured prompt builder for TypeScript. Compose LLM prompts from typed sections and render them as Markdown, XML-style markup, or plain text.

## Install

```sh
npm install promptic
```

## Quick start

```ts
import { pipe, markdown } from 'promptic/core/pipe';
import { identity } from 'promptic/core/sections/identity';
import { role } from 'promptic/core/sections/role';
import { rules } from 'promptic/core/sections/rules';
import { constraints } from 'promptic/core/sections/constraints';
import { render } from 'promptic/renderer/render';

const prompt = pipe(
  markdown,
  identity('A precise and concise assistant'),
  role('Answer questions about TypeScript'),
  rules('Be succinct', 'Use code examples when helpful'),
  constraints('Do not answer questions unrelated to TypeScript'),
);

console.log(render(prompt));
```

Output:

```markdown
## Identity

A precise and concise assistant

## Role

Answer questions about TypeScript

## Rules

- Be succinct
- Use code examples when helpful

## Constraints

- Do not answer questions unrelated to TypeScript
```

## Concepts

### Prompt

A `Prompt` is a plain object with an optional set of sections and a required `output` format. All sections are optional — only include what the model needs.

| Section       | Type                                   | Description                                    |
| ------------- | -------------------------------------- | ---------------------------------------------- |
| `identity`    | `string`                               | Who or what the model is (persona).            |
| `role`        | `string`                               | The job the model is asked to perform.         |
| `context`     | `{ title: string; content: string }[]` | Background information, each entry titled.     |
| `rules`       | `string[]`                             | Positive instructions the model should follow. |
| `constraints` | `string[]`                             | Boundaries the model must not cross.           |
| `examples`    | `{ human: string; assistant: string }[]` | Worked input/output pairs.                   |

### pipe

`pipe(initial, ...fns)` builds a prompt by applying a sequence of section builders left to right. Each builder receives the result of the previous one, so sections accumulate in call order.

```ts
import { pipe, markdown } from 'promptic/core/pipe';
import { identity } from 'promptic/core/sections/identity';
import { context } from 'promptic/core/sections/context';

const prompt = pipe(
  markdown,
  identity('A helpful assistant'),
  context('Today's date', '2026-07-21'),
);
```

### Section builders

All section builders return an `Apply` function `(prompt: Prompt) => Prompt`.

| Builder | Behaviour |
| --- | --- |
| `identity(content)` | Sets the identity. Replaces any previously set value. |
| `role(content)` | Sets the role. Replaces any previously set value. |
| `context(title, content)` | Appends a titled context block. Accumulates. |
| `rules(...rules)` | Appends one or more rules. Accumulates. |
| `constraints(...constraints)` | Appends one or more constraints. Accumulates. |
| `examples(human, assistant)` | Appends a human/assistant example pair. Accumulates. |

### Output formats

Three base prompts are available as starting points:

```ts
import { markdown, markup, raw } from 'promptic/core/prompt';
```

| Base | Format |
| --- | --- |
| `markdown` | Sections under `##` headings. |
| `markup` | Sections in XML-style tags, content entity-escaped. |
| `raw` | Sections introduced by uppercase labels. Plain text. |

### render

`render(prompt)` converts a `Prompt` to a string using the renderer for its `output` format. Individual renderers are also exported if you need to bypass dispatch.

```ts
import { render } from 'promptic/renderer/render';
import { markdown } from 'promptic/renderer/markdown';
import { markup } from 'promptic/renderer/markup';
import { raw } from 'promptic/renderer/raw';
```

## Output examples

Given the same prompt with `identity`, `rules`, and one `examples` pair:

**Markdown**

```markdown
## Identity

You are a code reviewer.

## Rules

- Be constructive
- Focus on correctness

## Examples

**Human:** What do you think of this loop?

**Assistant:** The loop looks correct. Consider extracting the condition for readability.
```

**Markup**

```xml
<identity>
You are a code reviewer.
</identity>

<rules>
<rule>Be constructive</rule>
<rule>Focus on correctness</rule>
</rules>

<examples>
<example>
<human>What do you think of this loop?</human>
<assistant>The loop looks correct. Consider extracting the condition for readability.</assistant>
</example>
</examples>
```

**Raw**

```
IDENTITY
You are a code reviewer.

RULES
Be constructive
Focus on correctness

EXAMPLES
What do you think of this loop?
The loop looks correct. Consider extracting the condition for readability.
```

## Development

```sh
npm test          # run tests
npm run test:watch  # watch mode
npm run build     # compile to dist/
npm run format    # format source
npm run verify    # lint source
```

## License

MIT
