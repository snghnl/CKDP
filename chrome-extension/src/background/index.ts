import 'webextension-polyfill';

let contentScriptReady = false;

// Handle messages from the side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'content-script-ready') {
    contentScriptReady = true;
    return false;
  }

  if (message.type === 'from_panel') {
    switch (message.action) {
      case 'activate-image-picker':
        // Forward the message to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          if (tabs[0]?.id) {
            chrome.tabs
              .sendMessage(tabs[0].id, { type: 'activate-image-picker' })
              .then(response => {
                sendResponse(response);
              })
              .catch(error => {
                console.error('Error sending message to content script:', error);
                sendResponse({ success: false, error: 'Content script not ready' });
              });
          }
        });
        return true; // Keep the message channel open for async response
      default:
        console.log('Unknown action:', message.action);
        sendResponse({ success: false, error: 'Unknown action' });
        return false;
    }
  }
  return false;
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
