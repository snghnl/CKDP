import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface ImagePreviewProps {
  imageInfo: any;
  onSave: (directory: string) => void;
}

export function ImagePreview({ imageInfo, onSave }: ImagePreviewProps) {
  const [directory, setDirectory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!directory) {
      setError('Please specify a directory');
      return;
    }
    onSave(directory);
    setDirectory('');
    setError(null);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ margin: '20px 0', textAlign: 'center' }}>
        <img
          src={imageInfo.src}
          alt={imageInfo.alt || 'Selected image'}
          style={{
            maxWidth: '100%',
            maxHeight: '300px',
            objectFit: 'contain',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '5px',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Directory"
          value={directory}
          onChange={e => setDirectory(e.target.value)}
          size="small"
          fullWidth
          error={!!error}
          helperText={error}
        />
        <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
