import 'webextension-polyfill';

// Handle messages from the side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'from_panel') {
    switch (message.action) {
      case 'activate-image-picker':
        // Handle image tag extraction
        console.log('Received request to extract image tags');
        // Send response immediately since we're not doing async work
        sendResponse({ success: true });
        break;
      default:
        console.log('Unknown action:', message.action);
        sendResponse({ success: false, error: 'Unknown action' });
    }
  }
  // Don't return true since we're not doing async work
  return false;
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
