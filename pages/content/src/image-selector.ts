let isSelectMode = false;

// 디버깅을 위한 초기 로그
console.log('[Chart Picker] Content script loaded');

// 이미지 선택 모드 활성화/비활성화
chrome.runtime.onMessage.addListener(message => {
  console.log('[Chart Picker] Received message:', message);
  try {
    if (message.type === 'ENABLE_IMAGE_SELECT') {
      isSelectMode = true;
      if (document.body) {
        document.body.style.cursor = 'crosshair';
      }
      addImageOverlays();
    } else if (message.type === 'DISABLE_IMAGE_SELECT') {
      isSelectMode = false;
      if (document.body) {
        document.body.style.cursor = 'default';
      }
      removeImageOverlays();
    }
  } catch (error) {
    console.error('[Chart Picker] Error handling message:', error);
  }
});

// 이미지에 오버레이 추가
function addImageOverlays() {
  try {
    const images = Array.from(document.getElementsByTagName('img'));
    console.log('[Chart Picker] Found images:', images.length);
    for (const img of images) {
      if (!img.dataset.hasOverlay && img.parentElement) {
        // 이미지가 보이는 상태인지 확인
        const rect = img.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          img.style.border = '2px solid red';
          img.style.cursor = 'pointer';
          img.dataset.hasOverlay = 'true';

          img.addEventListener('click', handleImageClick);
        }
      }
    }
  } catch (error) {
    console.error('[Chart Picker] Error adding overlays:', error);
  }
}

// 이미지 오버레이 제거
function removeImageOverlays() {
  try {
    const images = Array.from(document.getElementsByTagName('img'));
    for (const img of images) {
      if (img.dataset.hasOverlay) {
        img.style.border = '';
        img.style.cursor = '';
        delete img.dataset.hasOverlay;

        img.removeEventListener('click', handleImageClick);
      }
    }
  } catch (error) {
    console.error('[Chart Picker] Error removing overlays:', error);
  }
}

// 이미지 클릭 핸들러
function handleImageClick(event: MouseEvent) {
  if (!isSelectMode) return;

  try {
    event.preventDefault();
    event.stopPropagation();

    const img = event.target as HTMLImageElement;
    if (!img || !img.src) {
      console.log('[Chart Picker] No image or src found');
      return;
    }

    console.log('[Chart Picker] Image clicked:', {
      element: img,
      src: img.src,
      currentSrc: img.currentSrc,
      complete: img.complete,
    });

    // 이미지 요소의 HTML 코드 가져오기
    const imgHtml = img.outerHTML;

    // src 속성 추출 (상대 경로를 절대 경로로 변환)
    const srcMatch = imgHtml.match(/src=["']([^"']+)["']/);
    let imageUrl = srcMatch ? srcMatch[1] : img.src;

    // 상대 경로를 절대 경로로 변환
    if (imageUrl.startsWith('/')) {
      imageUrl = window.location.origin + imageUrl;
    } else if (!imageUrl.startsWith('http')) {
      imageUrl = new URL(imageUrl, window.location.href).href;
    }

    // alt 속성 추출
    const altMatch = imgHtml.match(/alt=["']([^"']+)["']/);
    const alt = altMatch ? altMatch[1] : '';

    // 이미지 이름 결정 (alt가 있으면 alt 사용, 없으면 URL의 마지막 부분 사용)
    const name = alt || imageUrl.split('/').pop() || '이미지';

    console.log('[Chart Picker] Selected image details:', {
      html: imgHtml,
      url: imageUrl,
      alt: alt,
      name: name,
      isAbsoluteUrl: imageUrl.startsWith('http'),
    });

    // 메시지 전송
    chrome.runtime.sendMessage(
      {
        type: 'CHART_IMAGE_CLICKED',
        payload: {
          id: Date.now().toString(),
          imageUrl,
          name,
          alt,
          html: imgHtml,
        },
      },
      response => {
        console.log('[Chart Picker] Message sent, response:', response);
        if (chrome.runtime.lastError) {
          console.error('[Chart Picker] Error sending message:', chrome.runtime.lastError);
        }
      },
    );

    // 선택 모드 비활성화
    isSelectMode = false;
    if (document.body) {
      document.body.style.cursor = 'default';
    }
    removeImageOverlays();
  } catch (error) {
    console.error('[Chart Picker] Error handling image click:', error);
  }
}

// DOM 변경 감지
const observer = new MutationObserver(mutations => {
  if (isSelectMode) {
    addImageOverlays();
  }
});

// 페이지 로드 완료 시
window.addEventListener('load', () => {
  try {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    console.log('[Chart Picker] Observer set up');
  } catch (error) {
    console.error('[Chart Picker] Error setting up observer:', error);
  }
});
