import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

interface ImagePreviewProps {
  imageInfo: any;
  onSave: (directory: string) => void;
  existingDirectories: string[];
}

export function ImagePreview({ imageInfo, onSave, existingDirectories }: ImagePreviewProps) {
  const [directory, setDirectory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isNewDirectoryDialogOpen, setIsNewDirectoryDialogOpen] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState('');

  const handleSave = () => {
    if (!directory) {
      setError('Please select or create a directory');
      return;
    }
    onSave(directory);
    setDirectory('');
    setError(null);
  };

  const handleNewDirectory = () => {
    if (!newDirectoryName.trim()) {
      setError('Directory name cannot be empty');
      return;
    }
    if (existingDirectories.includes(newDirectoryName.trim())) {
      setError('Directory already exists');
      return;
    }
    setDirectory(newDirectoryName.trim());
    setNewDirectoryName('');
    setError(null);
    setIsNewDirectoryDialogOpen(false);
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
        <FormControl sx={{ minWidth: 200 }} error={!!error}>
          <InputLabel>Directory</InputLabel>
          <Select
            value={directory}
            label="Directory"
            onChange={e => {
              setDirectory(e.target.value);
              setError(null);
            }}>
            {existingDirectories.map(dir => (
              <MenuItem key={dir} value={dir}>
                {dir}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<CreateNewFolderIcon />}
          onClick={() => setIsNewDirectoryDialogOpen(true)}>
          New Directory
        </Button>

        <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>
          Save
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      {/* New Directory Dialog */}
      <Dialog
        open={isNewDirectoryDialogOpen}
        onClose={() => {
          setIsNewDirectoryDialogOpen(false);
          setError(null);
          setNewDirectoryName('');
        }}>
        <DialogTitle>Create New Directory</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Directory Name"
            fullWidth
            value={newDirectoryName}
            onChange={e => {
              setNewDirectoryName(e.target.value);
              setError(null);
            }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsNewDirectoryDialogOpen(false);
              setError(null);
              setNewDirectoryName('');
            }}>
            Cancel
          </Button>
          <Button onClick={handleNewDirectory} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
