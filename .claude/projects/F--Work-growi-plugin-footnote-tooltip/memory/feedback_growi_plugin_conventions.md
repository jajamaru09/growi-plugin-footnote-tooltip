---
name: Growi 7.x script plugin build and registration conventions
description: Correct vite.config.ts, client-entry.tsx, and package.json patterns for working Growi script plugins
type: feedback
---

Growi 7.x script プラグインの正しいパターン。初回実装時にビルド設定とプラグイン登録の両方を間違えて動作しなかった。

## Vite設定

`build.lib` モードではなく `manifest: true` を使う。Growiは `dist/.vite/manifest.json` を読んでプラグインのJSファイルを発見する。

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: ['/client-entry.tsx'],
    },
  },
});
```

**Why:** `build.lib` モードだと manifest.json が生成されず、Growi がプラグインのエントリを見つけられない。

## pluginActivators の登録

配列ではなく**オブジェクト**で、プラグイン名をキーにして登録する。

```typescript
import config from './package.json' assert { type: 'json' };

if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators[config.name] = { activate, deactivate };
```

**Why:** 実際に動作している全てのGrowiプラグイン（copy-code-to-clipboard, remark-youtube, embed-site等）がこのパターンを使っている。

## growiFacade のアクセス

`declare const growiFacade` ではなく `window.growiFacade` から取得する。

## optionsGenerators のフォールバック

`customGenerateViewOptions` が未定義の場合、`generateViewOptions` にフォールバックする。

```typescript
const options = (originalGenerateViewOptions ?? optionsGenerators.generateViewOptions)(...args);
```

## package.json

- react/react-dom は `dependencies` に入れる（`peerDependencies` ではない）
- `"type": "module"` が必要
- tsconfig に `resolveJsonModule` と `allowSyntheticDefaultImports` が必要（package.json importのため）

**How to apply:** Growiプラグインを新規作成する際は、必ずこれらのパターンに従うこと。公式ドキュメントよりも実際に動いているプラグインのコードを参考にする。
