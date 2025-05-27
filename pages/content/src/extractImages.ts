import { Image } from '@extension/shared';

export function extractImageTagsFromPage(): HTMLImageElement[] {
  // Get all img elements from the body
  const images = document.body.getElementsByTagName('img');
  console.log(`found ${images.length} images`);

  // Convert HTMLCollection to Array for easier manipulation
  return Array.from(images);
}
export function processImageTags(images: HTMLImageElement[]): Image[] {
  return images.map(img => ({
    id: img.id,
    url: img.src,
    description: img.alt,
    width: img.width,
    height: img.height,
    // DOM interaction properties
    elementId: img.id,
    elementPath: img.src,
    pageUrl: window.location.href,
    captureTimestamp: Date.now(),
    // Position information for scrolling
    boundingRect: {
      top: img.offsetTop,
      left: img.offsetLeft,
      width: img.offsetWidth,
      height: img.offsetHeight,
    },
  }));
}
