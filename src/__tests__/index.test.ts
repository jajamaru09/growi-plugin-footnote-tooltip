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

  it('does nothing when no footnotes exist', async () => {
    const input = '<p>Just regular text with no footnotes.</p>';
    const output = await process(input);

    expect(output).not.toContain('footnote-tooltip');
    expect(output).not.toContain('<style>');
  });

  it('handles multiple footnotes correctly', async () => {
    const input = `
      <p>First<sup><a href="#user-content-fn-1" data-footnote-ref>1</a></sup> and second<sup><a href="#user-content-fn-2" data-footnote-ref>2</a></sup></p>
      <section data-footnotes class="footnotes">
        <ol>
          <li id="user-content-fn-1">
            <p>First footnote. <a href="#user-content-fnref-1" data-footnote-backref>↩</a></p>
          </li>
          <li id="user-content-fn-2">
            <p>Second footnote. <a href="#user-content-fnref-2" data-footnote-backref>↩</a></p>
          </li>
        </ol>
      </section>
    `;
    const output = await process(input);

    expect(output).toContain('First footnote.');
    expect(output).toContain('Second footnote.');
    const wrapperCount = (output.match(/class="footnote-tooltip-wrapper"/g) || []).length;
    expect(wrapperCount).toBe(2);
  });

  it('removes backref links from tooltip content', async () => {
    const input = `
      <p>Text<sup><a href="#user-content-fn-1" data-footnote-ref>1</a></sup></p>
      <section data-footnotes class="footnotes">
        <ol>
          <li id="user-content-fn-1">
            <p>Footnote with <a href="https://example.com">a link</a>. <a href="#user-content-fnref-1" data-footnote-backref aria-label="Back to reference 1">↩</a></p>
          </li>
        </ol>
      </section>
    `;
    const output = await process(input);

    expect(output).toContain('https://example.com');
    const backrefs = (output.match(/data-footnote-backref/g) || []).length;
    expect(backrefs).toBe(1);
  });

  it('injects exactly one style element with tooltip CSS', async () => {
    const input = `
      <p>Text<sup><a href="#user-content-fn-1" data-footnote-ref>1</a></sup></p>
      <section data-footnotes class="footnotes">
        <ol>
          <li id="user-content-fn-1">
            <p>Footnote. <a href="#user-content-fnref-1" data-footnote-backref>↩</a></p>
          </li>
        </ol>
      </section>
    `;
    const output = await process(input);

    const styleCount = (output.match(/<style>/g) || []).length;
    expect(styleCount).toBe(1);
    expect(output).toContain('.footnote-tooltip-wrapper');
    expect(output).toContain('background-color: #fff9c4');
  });

  it('preserves rich content in footnote tooltips', async () => {
    const input = `
      <p>Text<sup><a href="#user-content-fn-1" data-footnote-ref>1</a></sup></p>
      <section data-footnotes class="footnotes">
        <ol>
          <li id="user-content-fn-1">
            <p>See <code>console.log</code> and <a href="https://example.com">this link</a>. <a href="#user-content-fnref-1" data-footnote-backref>↩</a></p>
          </li>
        </ol>
      </section>
    `;
    const output = await process(input);

    expect(output).toContain('<code>console.log</code>');
    expect(output).toContain('https://example.com');
  });
});
