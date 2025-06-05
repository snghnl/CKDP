let imagePickerActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'activate-image-picker') {
    imagePickerActive = true;
    document.body.style.cursor = 'crosshair';
  }
});

document.addEventListener(
  'click',
  function handleClick(e) {
    if (!imagePickerActive) return;

    const target = e.target as HTMLImageElement;
    if (target.tagName.toLowerCase() === 'img') {
      const info = {
        src: target.src,
        alt: target.alt || '',
        width: target.width,
        height: target.height,
      };

      chrome.runtime.sendMessage({
        type: 'image-picked',
        payload: info,
      });

      // Cleanup
      imagePickerActive = false;
      document.body.style.cursor = 'auto';
      e.preventDefault();
      e.stopPropagation();
    }
  },
  true,
);
