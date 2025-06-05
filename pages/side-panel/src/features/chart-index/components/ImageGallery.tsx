import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

interface SavedImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  directory: string;
  savedAt: string;
}

interface ImageGalleryProps {
  images: SavedImage[];
  currentDirectory: string;
  onDirectoryChange: (directory: string) => void;
}

export function ImageGallery({ images, currentDirectory, onDirectoryChange }: ImageGalleryProps) {
  const directories = Array.from(new Set(images.map(img => img.directory)));
  const filteredImages = images.filter(img => (currentDirectory ? img.directory === currentDirectory : true));

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Saved Images
      </Typography>

      {/* Directory Navigation */}
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<FolderIcon />} onClick={() => onDirectoryChange('')} sx={{ mr: 1 }}>
          All
        </Button>
        {directories.map(dir => (
          <Button
            key={dir}
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={() => onDirectoryChange(dir)}
            sx={{ mr: 1 }}>
            {dir}
          </Button>
        ))}
      </Box>

      {/* Image Grid */}
      <Grid container spacing={2}>
        {filteredImages.map(image => (
          <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: 1,
                p: 1,
                textAlign: 'center',
              }}>
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'contain',
                }}
              />
              <Typography variant="caption" display="block">
                {image.directory}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
