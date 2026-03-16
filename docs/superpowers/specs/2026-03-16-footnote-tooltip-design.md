# growi-plugin-footnote-tooltip 設計書

## 概要

Growi 7.x 向けの rehype プラグイン。Markdown の脚注リンク（`[^1]`）にマウスをホバーすると、ページ下部の脚注内容を付箋風ツールチップで表示する。ページスクロールなしで脚注を確認できる。

## 要件

- Growi 7.x のプラグインシステム（`schemaVersion: 4`, `types: ["script"]`）に準拠
- 標準的な Markdown 脚注記法（`[^id]` / `[^id]: 内容`）に対応
- クライアントサイド JS 不要（CSS の `:hover` のみで制御）
- 付箋風の黄色いシンプルなデザイン

## アーキテクチャ

### 方式

rehype プラグインとして、HTML ツリー変換時に脚注リンクの隣にツールチップ用 DOM 要素を直接挿入する（ハイブリッドアプローチ C）。

### 処理の流れ

1. Markdown が remark/rehype パイプラインを通過
2. `remark-gfm` が脚注を HTML に変換（`<section data-footnotes>` が生成される）
3. 本プラグイン（rehype）が HTML ツリーを走査:
   - `<section data-footnotes>` 内の `<li id="user-content-fn-XXX">` から脚注内容を収集
   - 各脚注リンク（`<a data-footnote-ref>`）の親 `<sup>` にツールチップ DOM を挿入
   - CSS を `<style>` 要素としてツリー先頭に 1 回だけ挿入
4. CSS の `:hover` 擬似クラスでツールチップの表示/非表示を制御

### DOM 変換

**変換前:**
```html
<sup><a href="#user-content-fn-1" data-footnote-ref>1</a></sup>
```

**変換後:**
```html
<sup class="footnote-tooltip-wrapper">
  <a href="#user-content-fn-1" data-footnote-ref>1</a>
  <span class="footnote-tooltip">
    <p>脚注のテキストやリンクなど</p>
  </span>
</sup>
```

## スタイリング

付箋風デザイン。CSS のみで制御。

```css
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

.footnote-tooltip-wrapper {
  position: relative;
}

.footnote-tooltip-wrapper:hover .footnote-tooltip {
  display: block;
}
```

- 背景色: `#fff9c4`（Material Design Yellow 100）
- 位置: リンクの上方にポップアップ
- 幅: `max-width: 300px` で折り返し表示
- 影: 控えめな `box-shadow` で浮遊感を演出

## プラグイン実装詳細

### ロジック

```typescript
const rehypeFootnoteTooltip: Plugin = () => {
  return (tree: Node) => {
    // Step 1: footnotes セクションから脚注内容を収集
    //   <section data-footnotes> 内の <li id="user-content-fn-XXX"> を探索
    //   Map<id, children[]> に格納

    // Step 2: 脚注リンクを走査してツールチップ DOM を挿入
    //   <a data-footnote-ref> を持つ要素を検索
    //   href から対応する脚注 ID を特定
    //   親の <sup> に class="footnote-tooltip-wrapper" を追加
    //   <sup> の子要素に <span class="footnote-tooltip"> を追加し、
    //   脚注の children を複製して挿入

    // Step 3: <style> 要素をツリーの先頭に 1 回だけ挿入
  }
}
```

### 考慮事項

- **逆参照リンク除去**: 脚注内容に含まれる `↩` リンク（`a[data-footnote-backref]`）はツールチップ内から除去する
- **ノードの複製**: ディープコピーで元ツリーに影響を与えない
- **脚注なしの場合**: 脚注が存在しなければ何もしない（`<style>` も挿入しない）

## プロジェクト構成

```
growi-plugin-footnote-tooltip/
├── package.json          # Growi プラグインメタデータ
├── tsconfig.json
├── src/
│   └── index.ts          # rehype プラグイン本体
├── dist/                 # ビルド成果物
└── client-entry.tsx      # Growi プラグインエントリポイント
```

### package.json（主要フィールド）

```json
{
  "name": "growi-plugin-footnote-tooltip",
  "growiPlugin": {
    "schemaVersion": 4,
    "types": ["script"]
  }
}
```

## テスト方針

- rehype プラグインの単体テスト: 脚注を含む HTML ツリーを入力し、ツールチップ DOM が正しく挿入されることを検証
- 脚注なしの場合のテスト: 変換が何も行われないことを確認
- 複数脚注のテスト: 各リンクに対応する正しい脚注内容が複製されることを確認
