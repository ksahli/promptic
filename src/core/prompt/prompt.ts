/**
 * The structured, human-authored parts of a prompt.
 *
 * Every field is optional at the {@link Prompt} level, so a prompt may specify
 * as many or as few of these sections as needed. The sections are ordered from
 * the most general framing (who the model is) to the most concrete guidance
 * (worked examples).
 */
interface Content {
  /** Who or what the model is — its persona or self-description. */
  readonly identity: string;
  /** The job the model is being asked to perform. */
  readonly role: string;
  /** Background information the model should take into account, each entry a titled block. */
  readonly context: { title: string; content: string }[];
  /** Positive instructions the model should follow. */
  readonly rules: string[];
  /** Boundaries and limitations the model must not cross. */
  readonly constraints: string[];
  /** Worked human/assistant pairs demonstrating the desired behaviour. */
  readonly examples: { human: string; assistant: string }[];
}

/**
 * The rendering format a prompt is emitted in.
 *
 * - `markdown` — human-readable Markdown.
 * - `markup` — tag-based markup (e.g. XML-style sections).
 * - `raw` — plain, unformatted text.
 */
interface Output {
  output: 'markdown' | 'markup' | 'raw';
}

/**
 * A complete prompt: any subset of {@link Content} sections combined with a
 * required {@link Output} format.
 */
type Prompt = Partial<Content> & Output;

/**
 * A transformation from one prompt to another.
 *
 * Used to compose prompts by layering changes — each `Apply` takes the current
 * prompt and returns a new one.
 */
type Apply = (prompt: Prompt) => Prompt;

export type { Apply, Prompt, Content, Output };

/** A base prompt that renders as {@link Output.output | Markdown}. */
const markdown: Prompt = {
  output: 'markdown',
};

/** A base prompt that renders as {@link Output.output | markup}. */
const markup: Prompt = {
  output: 'markup',
};

/** A base prompt that renders as {@link Output.output | raw} text. */
const raw: Prompt = {
  output: 'raw',
};

export { markdown, markup, raw };
