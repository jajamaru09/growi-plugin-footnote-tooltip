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
