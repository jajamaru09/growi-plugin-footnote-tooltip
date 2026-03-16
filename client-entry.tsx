import config from './package.json' assert { type: 'json' };
import { rehypeFootnoteTooltip } from './src/index';

type OptionsGenerator = (...args: any[]) => any;

const growiFacade = (window as any).growiFacade;

const activate = (): void => {
  console.log('[footnote-tooltip] activate() called');
  console.log('[footnote-tooltip] growiFacade:', growiFacade);

  if (growiFacade?.markdownRenderer == null) {
    console.warn('[footnote-tooltip] growiFacade or markdownRenderer is null, aborting');
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;
  console.log('[footnote-tooltip] optionsGenerators:', optionsGenerators);

  // ページ表示用
  const originalGenerateViewOptions: OptionsGenerator | undefined =
    optionsGenerators.customGenerateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args: any[]) => {
    console.log('[footnote-tooltip] customGenerateViewOptions called');
    const options = (originalGenerateViewOptions ?? optionsGenerators.generateViewOptions)(...args);
    options.rehypePlugins = options.rehypePlugins ?? [];
    options.rehypePlugins.push(rehypeFootnoteTooltip);
    return options;
  };

  // エディタプレビュー用
  const originalGeneratePreviewOptions: OptionsGenerator | undefined =
    optionsGenerators.customGeneratePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args: any[]) => {
    console.log('[footnote-tooltip] customGeneratePreviewOptions called');
    const options = (originalGeneratePreviewOptions ?? optionsGenerators.generatePreviewOptions)(...args);
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
  if (growiFacade?.markdownRenderer == null) {
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

if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators[config.name] = { activate, deactivate };
console.log('[footnote-tooltip] registered as:', config.name);
