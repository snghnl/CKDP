import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ACTIVATE_IMAGE_SELECT_MODE') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'ENABLE_IMAGE_SELECT',
        });
      }
    });
  }

  if (message.type === 'CHART_IMAGE_CLICKED') {
    // 사이드 패널로 다시 전달 (또는 storage에 저장)
    chrome.runtime.sendMessage(message);
  }
});
