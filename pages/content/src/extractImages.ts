let imagePickerActive = false;

// Notify that content script is ready
chrome.runtime.sendMessage({ type: 'content-script-ready' });

// Function to set cursor style
function setCursorStyle(active: boolean) {
  try {
    document.body.style.cursor = active ? 'crosshair' : 'auto';
  } catch (error) {
    console.error('Error setting cursor style:', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'activate-image-picker') {
    try {
      imagePickerActive = true;
      setCursorStyle(true);
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error activating image picker:', error);
      sendResponse({ success: false, error: 'Failed to activate image picker' });
    }
  }
  return true; // Keep the message channel open for async response
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

      // Cleanup first to ensure UI is responsive
      imagePickerActive = false;
      setCursorStyle(false);
      e.preventDefault();
      e.stopPropagation();

      // Send message after cleanup
      try {
        chrome.runtime
          .sendMessage({
            type: 'image-picked',
            payload: info,
          })
          .catch(error => {
            console.error('Error sending image info:', error);
          });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  },
  true,
);

// Ensure cursor is reset when the page is unloaded
window.addEventListener('unload', () => {
  setCursorStyle(false);
});
