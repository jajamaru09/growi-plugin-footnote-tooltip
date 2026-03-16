import type { Plugin } from 'unified';
import type { Root, Element, ElementContent } from 'hast';
import { visit, SKIP } from 'unist-util-visit';

const TOOLTIP_CSS = `
.footnote-tooltip-wrapper {
  position: relative;
}
.footnote-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff9c4;
  border: 1px solid #f0e68c;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.85em;
  line-height: 1.5;
  max-width: 300px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  white-space: normal;
}
.footnote-tooltip-wrapper:hover .footnote-tooltip {
  display: block;
}
`.trim();

function deepClone<T>(node: T): T {
  return JSON.parse(JSON.stringify(node));
}

function removeBackrefs(nodes: ElementContent[]): ElementContent[] {
  return nodes
    .filter((node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const props = node.properties ?? {};
        if (props.dataFootnoteBackref != null) return false;
      }
      return true;
    })
    .map((node) => {
      if (node.type === 'element' && node.children) {
        return { ...node, children: removeBackrefs(node.children) };
      }
      return node;
    });
}

function collectFootnotes(tree: Root): Map<string, ElementContent[]> {
  const footnotes = new Map<string, ElementContent[]>();

  visit(tree, 'element', (node: Element) => {
    if (
      node.tagName === 'section' &&
      node.properties?.dataFootnotes != null
    ) {
      visit(node, 'element', (li: Element) => {
        if (li.tagName === 'li' && typeof li.properties?.id === 'string') {
          const id = li.properties.id as string;
          const clonedChildren = deepClone(li.children) as ElementContent[];
          footnotes.set(id, removeBackrefs(clonedChildren));
        }
      });
      return SKIP;
    }
  });

  return footnotes;
}

export const rehypeFootnoteTooltip: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const footnotes = collectFootnotes(tree);

    if (footnotes.size === 0) return;

    // Insert tooltip spans next to footnote ref links
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'sup') return;

      const refLink = node.children.find(
        (child): child is Element =>
          child.type === 'element' &&
          child.tagName === 'a' &&
          child.properties?.dataFootnoteRef != null,
      );
      if (!refLink) return;

      const href = String(refLink.properties?.href ?? '');
      const fnId = href.replace(/^#/, '');
      const content = footnotes.get(fnId);
      if (!content) return;

      // Add wrapper class
      node.properties = node.properties ?? {};
      const existing = node.properties.className;
      const classes: (string | number)[] = Array.isArray(existing)
        ? existing.filter((c): c is string | number => typeof c === 'string' || typeof c === 'number')
        : existing != null ? [existing as string | number] : [];
      classes.push('footnote-tooltip-wrapper');
      node.properties.className = classes;

      // Insert tooltip span
      const tooltipSpan: Element = {
        type: 'element',
        tagName: 'span',
        properties: { className: ['footnote-tooltip'] },
        children: content,
      };
      node.children.push(tooltipSpan);

      return SKIP;
    });

    // Inject <style> at root
    const styleElement: Element = {
      type: 'element',
      tagName: 'style',
      properties: {},
      children: [{ type: 'text', value: TOOLTIP_CSS }],
    };
    tree.children.unshift(styleElement);
  };
};
