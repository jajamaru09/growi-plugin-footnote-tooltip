import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { rehypeFootnoteTooltip } from '../index';

const process = async (html: string): Promise<string> => {
  const result = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeFootnoteTooltip)
    .use(rehypeStringify)
    .process(html);
  return String(result);
};

describe('rehypeFootnoteTooltip', () => {
  it('inserts tooltip span next to footnote ref link', async () => {
    const input = `
      <p>Some text<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
      <section data-footnotes class="footnotes">
        <ol>
          <li id="user-content-fn-1">
            <p>This is the footnote content. <a href="#user-content-fnref-1" data-footnote-backref aria-label="Back to reference 1">↩</a></p>
          </li>
        </ol>
      </section>
    `;
    const output = await process(input);

    expect(output).toContain('footnote-tooltip-wrapper');
    expect(output).toContain('class="footnote-tooltip"');
    expect(output).toContain('This is the footnote content.');
    // Extract tooltip span content and verify no backref links inside it
    const tooltipMatch = output.match(/class="footnote-tooltip">([\s\S]*?)<\/span>/);
    expect(tooltipMatch).not.toBeNull();
    expect(tooltipMatch![1]).not.toContain('data-footnote-backref');
  });
});
