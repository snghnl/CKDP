chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'SCROLL_TO_CHART') {
    window.scrollTo({ top: message.position - 80, behavior: 'smooth' });
  }
});
