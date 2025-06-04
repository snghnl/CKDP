const generateId = () => crypto.randomUUID();

// 이미지 URL에서 파일 이름 추출
const getImageNameFromUrl = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split('/');
    const filename = segments.pop() || 'Unknown';
    return decodeURIComponent(filename);
  } catch {
    return 'Unknown Image';
  }
};

// 최근 선택 이미지를 chrome.storage.local에 저장
const saveToRecentSelections = (chart: { id: string; name: string; imageUrl: string }) => {
  chrome.storage.local.get(['recentCharts'], result => {
    const existing: (typeof chart)[] = result.recentCharts || [];
    const updated = [chart, ...existing.filter(c => c.imageUrl !== chart.imageUrl)].slice(0, 10);
    chrome.storage.local.set({ recentCharts: updated });
  });
};

// 선택 모드 상태 관리
let imageSelectMode = false;

const enableImageSelectMode = () => {
  imageSelectMode = true;
  document.body.style.cursor = 'crosshair';
  console.log('[Material Picker] 🟢 이미지 선택 모드 ON');
};

const disableImageSelectMode = () => {
  imageSelectMode = false;
  document.body.style.cursor = 'default';
  console.log('[Material Picker] 🔴 이미지 선택 모드 OFF');
};

// 메시지 수신 → 이미지 선택 모드 진입
chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'ENABLE_IMAGE_SELECT') {
    enableImageSelectMode();
  }
});

// 드래그 시 시작 좌표 및 선택 박스 요소
let startX = 0,
  startY = 0;
let selectionBox: HTMLDivElement | null = null;

// 마우스 드래그 시작
const onMouseDown = (e: MouseEvent) => {
  if (!imageSelectMode) return;

  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement('div');
  selectionBox.style.position = 'fixed';
  selectionBox.style.zIndex = '999999';
  selectionBox.style.border = '2px dashed #0057ff';
  selectionBox.style.background = 'rgba(0, 87, 255, 0.1)';
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  document.body.appendChild(selectionBox);

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// 마우스 드래그 중 → 선택 박스 크기 조절
const onMouseMove = (e: MouseEvent) => {
  if (!selectionBox) return;

  const width = e.clientX - startX;
  const height = e.clientY - startY;

  selectionBox.style.width = `${Math.abs(width)}px`;
  selectionBox.style.height = `${Math.abs(height)}px`;
  selectionBox.style.left = `${Math.min(e.clientX, startX)}px`;
  selectionBox.style.top = `${Math.min(e.clientY, startY)}px`;
};

// 마우스 드래그 종료
const onMouseUp = () => {
  if (!selectionBox) return;

  const box = selectionBox.getBoundingClientRect();
  const centerX = box.left + box.width / 2;
  const centerY = box.top + box.height / 2;

  const elements = document.elementsFromPoint(centerX, centerY);
  const image = elements.find(el => el.tagName === 'IMG') as HTMLImageElement | undefined;

  if (image) {
    const chart = {
      id: generateId(),
      name: getImageNameFromUrl(image.src),
      imageUrl: image.src,
    };

    saveToRecentSelections(chart); // ✅ 최근 선택 저장
    chrome.runtime.sendMessage({
      type: 'CHART_IMAGE_CLICKED',
      payload: chart,
    });
  }

  selectionBox.remove();
  selectionBox = null;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  disableImageSelectMode();
};

// 드래그 감지 시작
document.addEventListener('mousedown', onMouseDown);

console.log('[Material Picker] ✅ content script loaded');
