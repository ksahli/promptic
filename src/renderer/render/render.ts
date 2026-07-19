import type { Prompt } from 'promptic/core/prompt';
import { markdown } from 'promptic/renderer/markdown';
import { markup } from 'promptic/renderer/markup';
import { raw } from 'promptic/renderer/raw';

/**
 * Renders a {@link Prompt} to a string using the renderer for its `output`
 * format.
 *
 * This is the primary entry point of the renderer package; it dispatches to
 * {@link markdown}, {@link markup}, or {@link raw} based on `prompt.output`. The
 * per-format functions remain available for callers that want to bypass
 * dispatch.
 *
 * @param prompt - The prompt to render.
 * @returns The rendered prompt in the requested output format.
 */
function render(prompt: Prompt): string {
  switch (prompt.output) {
    case 'markdown':
      return markdown(prompt);
    case 'markup':
      return markup(prompt);
    case 'raw':
      return raw(prompt);
  }
}

export { render };
