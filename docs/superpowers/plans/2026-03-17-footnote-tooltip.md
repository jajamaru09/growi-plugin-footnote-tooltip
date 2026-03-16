# Footnote Tooltip Plugin Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Growi 7.x rehype plugin that shows footnote content as a sticky-note tooltip on hover, with no client-side JS.

**Architecture:** A rehype plugin (`src/index.ts`) walks the hast tree, collects footnote definitions from `<section data-footnotes>`, deep-copies their content into tooltip `<span>` elements beside each footnote reference link, and injects a `<style>` block at the tree root. `client-entry.tsx` registers the plugin into Growi's markdown renderer for both view and preview modes.

**Tech Stack:** TypeScript, unified/rehype (hast), Vite, vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Create | Growi plugin metadata, dependencies, scripts |
| `tsconfig.json` | Create | TypeScript config |
| `tsconfig.node.json` | Create | TypeScript config for Vite node context |
| `vite.config.ts` | Create | Vite build config (library mode, externals) |
| `src/index.ts` | Create | rehype plugin: collect footnotes, inject tooltips + style |
| `client-entry.tsx` | Create | Growi plugin entry: activate/deactivate, register rehype plugin |
| `src/__tests__/index.test.ts` | Create | Unit tests for the rehype plugin |

---

## Chunk 1: Project Scaffolding

### Task 1: Initialize package.json

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "growi-plugin-footnote-tooltip",
  "version": "0.1.0",
  "description": "Growi plugin that shows footnote content as tooltips on hover",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/hast": "^3.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "hast-util-from-html": "^2.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "rehype-stringify": "^10.0.0",
    "typescript": "^5.0.0",
    "unified": "^11.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "growiPlugin": {
    "schemaVersion": 4,
    "types": ["script"]
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: `node_modules` created, `package-lock.json` generated

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: initialize package.json with Growi plugin metadata"
```

### Task 2: Create TypeScript and Vite config

**Files:**
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`

- [ ] **Step 1: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["src", "client-entry.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 2: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: Create vite.config.ts**

```typescript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'client-entry.tsx',
      formats: ['es'],
      fileName: 'client-entry',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors (may warn about missing source files, that's OK at this stage)

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json tsconfig.node.json vite.config.ts
git commit -m "chore: add TypeScript and Vite configuration"
```

---

## Chunk 2: Rehype Plugin Core (TDD)

### Task 3: Write failing test — single footnote tooltip insertion

**Files:**
- Create: `src/__tests__/index.test.ts`
- Create: `src/index.ts` (empty placeholder)

- [ ] **Step 1: Create empty plugin placeholder**

Create `src/index.ts`:

```typescript
import type { Plugin } from 'unified';
import type { Root } from 'hast';

export const rehypeFootnoteTooltip: Plugin<[], Root> = () => {
  return () => {};
};
```

- [ ] **Step 2: Write the failing test for single footnote**

Create `src/__tests__/index.test.ts`:

```typescript
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

    // Should have tooltip wrapper class on sup
    expect(output).toContain('footnote-tooltip-wrapper');
    // Should have tooltip span with footnote content
    expect(output).toContain('class="footnote-tooltip"');
    expect(output).toContain('This is the footnote content.');
    // Should NOT contain backref link in tooltip
    expect(output).not.toMatch(/class="footnote-tooltip"[^]*data-footnote-backref/);
  });
});
```

- [ ] **Step 3: Add rehype-parse to devDependencies**

Run: `npm install --save-dev rehype-parse`

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/__tests__/index.test.ts`
Expected: FAIL — tooltip wrapper not found in output

- [ ] **Step 5: Commit**

```bash
git add src/index.ts src/__tests__/index.test.ts package.json package-lock.json
git commit -m "test: add failing test for single footnote tooltip insertion"
```

### Task 4: Implement rehype plugin core logic

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Implement the plugin**

Replace `src/index.ts` with:

```typescript
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
      const classes = Array.isArray(existing) ? existing : existing ? [existing] : [];
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
```

- [ ] **Step 2: Add unist-util-visit to devDependencies**

Run: `npm install --save-dev unist-util-visit`

- [ ] **Step 3: Run test to verify it passes**

Run: `npx vitest run src/__tests__/index.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/index.ts package.json package-lock.json
git commit -m "feat: implement rehype footnote tooltip plugin core"
```

### Task 5: Write and pass additional tests

**Files:**
- Modify: `src/__tests__/index.test.ts`

- [ ] **Step 1: Add test for no-footnote case**

Append to the `describe` block in `src/__tests__/index.test.ts`:

```typescript
  it('does nothing when no footnotes exist', async () => {
    const input = '<p>Just regular text with no footnotes.</p>';
    const output = await process(input);

    expect(output).not.toContain('footnote-tooltip');
    expect(output).not.toContain('<style>');
  });
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run src/__tests__/index.test.ts`
Expected: PASS (plugin already handles this case)

- [ ] **Step 3: Add test for multiple footnotes**

Append to the `describe` block:

```typescript
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
    // Should have exactly 2 tooltip wrappers
    const wrapperCount = (output.match(/footnote-tooltip-wrapper/g) || []).length;
    expect(wrapperCount).toBe(2);
  });
```

- [ ] **Step 4: Add test for backref removal**

Append to the `describe` block:

```typescript
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

    // Regular link should be preserved
    expect(output).toContain('https://example.com');
    // Backref should be removed from tooltip
    // Count backref occurrences — should only be in the original footnotes section, not in tooltip
    const backrefs = (output.match(/data-footnote-backref/g) || []).length;
    expect(backrefs).toBe(1); // Only the original, not in tooltip
  });
```

- [ ] **Step 5: Add test for style injection**

Append to the `describe` block:

```typescript
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
```

- [ ] **Step 6: Add test for rich content in footnotes**

Append to the `describe` block:

```typescript
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
```

- [ ] **Step 7: Run all tests**

Run: `npx vitest run src/__tests__/index.test.ts`
Expected: All 6 tests PASS

- [ ] **Step 8: Commit**

```bash
git add src/__tests__/index.test.ts
git commit -m "test: add tests for no-footnote, multiple, backref removal, and rich content"
```

---

## Chunk 3: Growi Plugin Entry Point & Build

### Task 6: Create client-entry.tsx

**Files:**
- Create: `client-entry.tsx`

- [ ] **Step 1: Create client-entry.tsx**

```tsx
import { rehypeFootnoteTooltip } from './src/index';

declare const growiFacade: any;

type OptionsGenerator = (...args: any[]) => any;

const activate = (): void => {
  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;

  // ページ表示用
  const originalGenerateViewOptions: OptionsGenerator | undefined =
    optionsGenerators.customGenerateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args: any[]) => {
    const options = originalGenerateViewOptions?.(...args) ?? {};
    options.rehypePlugins = options.rehypePlugins ?? [];
    options.rehypePlugins.push(rehypeFootnoteTooltip);
    return options;
  };

  // エディタプレビュー用
  const originalGeneratePreviewOptions: OptionsGenerator | undefined =
    optionsGenerators.customGeneratePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args: any[]) => {
    const options = originalGeneratePreviewOptions?.(...args) ?? {};
    options.rehypePlugins = options.rehypePlugins ?? [];
    options.rehypePlugins.push(rehypeFootnoteTooltip);
    return options;
  };

  // Store originals for deactivate
  (activate as any)._origView = originalGenerateViewOptions;
  (activate as any)._origPreview = originalGeneratePreviewOptions;
};

const deactivate = (): void => {
  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;
  const origView = (activate as any)._origView;
  const origPreview = (activate as any)._origPreview;

  if (origView !== undefined) {
    optionsGenerators.customGenerateViewOptions = origView;
  }
  if (origPreview !== undefined) {
    optionsGenerators.customGeneratePreviewOptions = origPreview;
  }
};

if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = [];
}
(window as any).pluginActivators.push({ activate, deactivate });
```

- [ ] **Step 2: Commit**

```bash
git add client-entry.tsx
git commit -m "feat: add Growi plugin entry point with activate/deactivate"
```

### Task 7: Verify build

**Files:**
- No new files

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run Vite build**

Run: `npm run build`
Expected: Build succeeds, `dist/` directory created with `client-entry.js`

### Task 8: Final verification

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 2: Run full build**

Run: `npm run build`
Expected: Clean build with no errors

- [ ] **Step 3: Verify output files**

Run: `ls dist/`
Expected: `client-entry.js` present
