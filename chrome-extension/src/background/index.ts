import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('[background] theme loaded:', theme);
});

console.log('Background loaded');

// 🧠 최신 차트 상태 저장
let lastCharts: any[] = [];

// ✅ 메시지 수신
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'CHARTS_DETECTED':
      console.log('[background] 차트 수신:', message.charts.length);
      lastCharts = message.charts;

      // 🔄 즉시 전체 브로드캐스트
      chrome.runtime.sendMessage({
        type: 'CHARTS_DETECTED',
        charts: lastCharts,
      });
      break;

    case 'SCROLL_TO_CHART':
      console.log('[background] 스크롤 요청 (side-panel → content):', message.position);

      // 스크롤 실행 요청 → content script
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.id !== undefined) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              type: 'SCROLL_TO_CHART',
              position: message.position,
            },
            response => {
              if (chrome.runtime.lastError) {
                console.warn('[background] SCROLL_TO_CHART 실패:', chrome.runtime.lastError.message);
              }
            },
          );
        }
      });
      break;

    default:
      console.warn('[background] 알 수 없는 메시지:', message);
  }
});

// ✅ 사이드패널이 연결될 경우 → 최신 차트 전송
chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'sidepanel-init') {
    console.log('[background] side-panel 연결됨 → 최신 차트 전달');
    port.postMessage({
      type: 'CHARTS_DETECTED',
      charts: lastCharts,
    });
  }
});
