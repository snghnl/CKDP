import html2canvas from 'html2canvas';

const createSelectionBox = () => {
  const box = document.createElement('div');
  box.id = 'material-picker-selection-box';
  box.style.position = 'fixed';
  box.style.border = '2px dashed #4f46e5';
  box.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
  box.style.zIndex = '999999';
  box.style.pointerEvents = 'none';
  return box;
};

let startX = 0;
let startY = 0;
let box: HTMLDivElement | null = null;

document.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  startX = e.clientX;
  startY = e.clientY;
  box = createSelectionBox();
  document.body.appendChild(box);
  box.style.left = `${startX}px`;
  box.style.top = `${startY}px`;
});

document.addEventListener('mousemove', e => {
  if (!box) return;
  const width = e.clientX - startX;
  const height = e.clientY - startY;
  box.style.width = `${Math.abs(width)}px`;
  box.style.height = `${Math.abs(height)}px`;
  box.style.left = `${Math.min(e.clientX, startX)}px`;
  box.style.top = `${Math.min(e.clientY, startY)}px`;
});

document.addEventListener('mouseup', async e => {
  if (!box) return;
  const rect = {
    x: Math.min(e.clientX, startX),
    y: Math.min(e.clientY, startY),
    width: Math.abs(e.clientX - startX),
    height: Math.abs(e.clientY - startY),
  };
  box.remove();
  box = null;

  // 📸 영역 캡처 → base64 이미지
  const canvas = await html2canvas(document.body, {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
  });
  const dataUrl = canvas.toDataURL('image/png');

  // 📨 이미지 전송
  chrome.runtime.sendMessage({
    type: 'CAPTURED_IMAGE',
    payload: {
      base64: dataUrl,
      rect,
    },
  });

  console.log('📤 이미지 전송됨');
});
