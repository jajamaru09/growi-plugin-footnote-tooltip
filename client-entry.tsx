import { rehypeFootnoteTooltip } from './src/index';

declare const growiFacade: any;

type OptionsGenerator = (...args: any[]) => any;

const activate = (): void => {
  console.log('[footnote-tooltip] activate() called');
  console.log('[footnote-tooltip] growiFacade:', typeof growiFacade, growiFacade);

  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    console.warn('[footnote-tooltip] growiFacade or markdownRenderer is null, aborting');
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;
  console.log('[footnote-tooltip] optionsGenerators:', optionsGenerators);
  console.log('[footnote-tooltip] customGenerateViewOptions:', typeof optionsGenerators.customGenerateViewOptions);
  console.log('[footnote-tooltip] customGeneratePreviewOptions:', typeof optionsGenerators.customGeneratePreviewOptions);

  // ページ表示用
  const originalGenerateViewOptions: OptionsGenerator | undefined =
    optionsGenerators.customGenerateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args: any[]) => {
    console.log('[footnote-tooltip] customGenerateViewOptions called with args:', args);
    const options = originalGenerateViewOptions?.(...args) ?? {};
    options.rehypePlugins = options.rehypePlugins ?? [];
    options.rehypePlugins.push(rehypeFootnoteTooltip);
    console.log('[footnote-tooltip] rehypePlugins after push:', options.rehypePlugins);
    return options;
  };

  // エディタプレビュー用
  const originalGeneratePreviewOptions: OptionsGenerator | undefined =
    optionsGenerators.customGeneratePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args: any[]) => {
    console.log('[footnote-tooltip] customGeneratePreviewOptions called with args:', args);
    const options = originalGeneratePreviewOptions?.(...args) ?? {};
    options.rehypePlugins = options.rehypePlugins ?? [];
    options.rehypePlugins.push(rehypeFootnoteTooltip);
    return options;
  };

  // Store originals for deactivate
  (activate as any)._origView = originalGenerateViewOptions;
  (activate as any)._origPreview = originalGeneratePreviewOptions;
  console.log('[footnote-tooltip] activate() completed successfully');
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

console.log('[footnote-tooltip] script loaded, registering pluginActivators');
console.log('[footnote-tooltip] current window.pluginActivators:', (window as any).pluginActivators);

if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = [];
}
(window as any).pluginActivators.push({ activate, deactivate });
console.log('[footnote-tooltip] registered, pluginActivators length:', (window as any).pluginActivators.length);
