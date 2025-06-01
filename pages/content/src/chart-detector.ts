console.log('[MaterialPicker] content script loaded');

// 1. 모든 이미지 가져오기
const allImages = Array.from(document.querySelectorAll('img'));
console.log('[MaterialPicker] 전체 이미지 수:', allImages.length);

// 2. 모든 이미지 요소를 차트처럼 처리
const charts = allImages.map((el, index) => ({
  id: `chart-${index}`,
  title: el.getAttribute('alt') || el.getAttribute('title') || `이미지 ${index + 1}`,
  type: el.tagName.toLowerCase(),
  position: el.getBoundingClientRect().top + window.scrollY,
  src: (el as HTMLImageElement).src,
  element: el,
}));

// 3. 디버깅 출력
charts.forEach(chart => {
  console.log('[탐지된 이미지]', chart.title, chart.src);
});
console.log('[MaterialPicker] 전송할 이미지 수:', charts.length);

// 4. 사이드 패널로 전송 (element 제외)
chrome.runtime.sendMessage({
  type: 'CHARTS_DETECTED',
  charts: charts.map(({ element, ...rest }) => rest),
});

// ✅ 5. 패널에서 클릭하면 스크롤 이동 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCROLL_TO_CHART') {
    window.scrollTo({
      top: message.position,
      behavior: 'smooth',
    });
  }
});
