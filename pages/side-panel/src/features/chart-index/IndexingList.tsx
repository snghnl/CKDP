import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { ImagePicker } from './components/ImagePicker';
import { ImagePreview } from './components/ImagePreview';
import { ImageGallery } from './components/ImageGallery';
import { Chart, SavedImage, Citation } from '@extension/shared';

export function IndexingList({
  setChart,
  setCitation,
}: {
  setChart: (chart: Chart) => void;
  setCitation: (citation: Citation[]) => void;
}) {
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState<string>('');

  // Load saved images on component mount
  useEffect(() => {
    loadSavedImages();
  }, []);

  const loadSavedImages = async () => {
    try {
      const result = await chrome.storage.local.get('savedImages');
      setSavedImages(result.savedImages || []);
    } catch (error) {
      console.error('Error loading saved images:', error);
    }
  };

  const handleSaveImage = async (directory: string) => {
    try {
      const newImage: SavedImage = {
        id: Date.now().toString(),
        ...imageInfo,
        directory,
        savedAt: new Date().toISOString(),
      };

      const updatedImages = [...savedImages, newImage];
      await chrome.storage.local.set({ savedImages: updatedImages });
      setSavedImages(updatedImages);
      setImageInfo(null);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleNewDirectory = async (directory: string) => {
    try {
      // Update the current directory
      setCurrentDirectory(directory);

      // Reload saved images to ensure we have the latest data
      await loadSavedImages();
    } catch (error) {
      console.error('Error handling new directory:', error);
    }
  };

  const existingDirectories = Array.from(new Set(savedImages.map(img => img.directory)));

  return (
    <Box sx={{ p: 2 }}>
      <ImagePicker onImagePicked={setImageInfo} />

      {imageInfo && (
        <ImagePreview imageInfo={imageInfo} onSave={handleSaveImage} existingDirectories={existingDirectories} />
      )}

      <ImageGallery
        images={savedImages}
        currentDirectory={currentDirectory}
        onDirectoryChange={setCurrentDirectory}
        onNewDirectory={handleNewDirectory}
        onNewChart={setChart}
        onNewCitation={setCitation}
      />
    </Box>
  );
}
