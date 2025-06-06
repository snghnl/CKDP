import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  IconButton,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Chart, SavedImage, Citation } from '@extension/shared';
import { makeNewChart, makeNewCitation } from '@extension/shared';

interface ImageGalleryProps {
  images: SavedImage[];
  currentDirectory: string;
  onDirectoryChange: (directory: string) => void;
  onNewDirectory: (directory: string) => void;
  onNewChart: (image: Chart) => void;
  onNewCitation: (citation: Citation[]) => void;
}

export function ImageGallery({
  images,
  currentDirectory,
  onDirectoryChange,
  onNewDirectory,
  onNewChart,
  onNewCitation,
}: ImageGalleryProps) {
  const [isNewDirectoryDialogOpen, setIsNewDirectoryDialogOpen] = useState(false);
  const [newDirectoryName, setNewDirectoryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const directories = Array.from(new Set(images.map(img => img.directory)));
  const filteredImages = images.filter(img => (currentDirectory ? img.directory === currentDirectory : true));

  const handleNewDirectory = () => {
    if (!newDirectoryName.trim()) {
      setError('Directory name cannot be empty');
      return;
    }
    if (directories.includes(newDirectoryName.trim())) {
      setError('Directory already exists');
      return;
    }
    onNewDirectory(newDirectoryName.trim());
    setNewDirectoryName('');
    setError(null);
    setIsNewDirectoryDialogOpen(false);
  };

  const fetchTableData = async (image: SavedImage) => {
    try {
      const response = await fetch('http://localhost:3000/api/table-data', {
        method: 'POST',
        body: JSON.stringify({ file: image.src }),
      });
      const data = await response.json();

      const chart = makeNewChart(image, data);
      const citation = makeNewCitation(data);

      onNewChart(chart);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          borderRadius: 1,
          p: 1,
        }}
        onClick={() => setIsExpanded(!isExpanded)}>
        <Typography variant="h6">Saved Images</Typography>
        <IconButton size="small">{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
      </Box>

      <Collapse in={isExpanded}>
        {/* Directory Navigation */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Directory</InputLabel>
            <Select value={currentDirectory} label="Directory" onChange={e => onDirectoryChange(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {directories.map(dir => (
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
        </Box>

        {/* Image Grid */}
        <Grid container spacing={2}>
          {filteredImages.map(image => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
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
                <Button variant="contained" color="primary" onClick={() => fetchTableData(image)}>
                  테이블 생성하기
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Collapse>

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
