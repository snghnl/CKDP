import { extractImageTagsFromPage, processImageTags } from '@src/extractImages';

console.log('content script loaded');

// Expose functions to window object
(window as any).extractImageTagsFromPage = extractImageTagsFromPage;
(window as any).processImageTags = processImageTags;

// Run the extraction
processImageTags(extractImageTagsFromPage());