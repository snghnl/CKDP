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
import type { GridProps } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Chart, SavedImage, Citation } from '@extension/shared';
import { makeNewChart, makeNewCitation } from '@extension/shared';
import { supabase } from '../../../lib/supabase';

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
    const newDirectory = newDirectoryName.trim();
    onNewDirectory(newDirectory);
    onDirectoryChange(newDirectory);
    setNewDirectoryName('');
    setError(null);
    setIsNewDirectoryDialogOpen(false);
  };

  const fetchTableData = async (image: SavedImage) => {
    try {
      // Get current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error('Failed to get session: ' + sessionError.message);
      }

      if (!session?.access_token) {
        throw new Error('No authentication token available. Please sign in again.');
      }

      // Check if token is expired
      const tokenExp = session.expires_at;
      if (tokenExp && tokenExp * 1000 < Date.now()) {
        // Try to refresh the session
        const {
          data: { session: newSession },
          error: refreshError,
        } = await supabase.auth.refreshSession();

        if (refreshError) {
          throw new Error('Failed to refresh session: ' + refreshError.message);
        }

        if (!newSession?.access_token) {
          throw new Error('Failed to refresh session. Please sign in again.');
        }
      }

      // Get the current token (either original or refreshed)
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      const token = currentSession?.access_token;

      if (!token) {
        throw new Error('No valid authentication token available. Please sign in again.');
      }

      const response = await fetch('https://ckdp-backend-1071583860130.europe-west1.run.app/openai/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ image_url: image.src }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();

      if (!responseData) {
        throw new Error('Invalid response data format');
      }

      const chart = makeNewChart(image, responseData);
      const citation = makeNewCitation(responseData);

      if (chart && citation) {
        onNewChart(chart);
        onNewCitation(citation);
      } else {
        throw new Error('Failed to create chart or citation');
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('테이블 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
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
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
            mt: 2,
          }}>
          <FormControl
            sx={{
              minWidth: { xs: '100%', sm: 200 },
              width: { xs: '100%', sm: 'auto' },
            }}>
            <InputLabel>Directory</InputLabel>
            <Select
              value={currentDirectory}
              label="Directory"
              onChange={e => onDirectoryChange(e.target.value)}
              size="small">
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
            onClick={() => setIsNewDirectoryDialogOpen(true)}
            size="small"
            sx={{
              whiteSpace: 'nowrap',
              minWidth: { xs: '100%', sm: 'auto' },
            }}>
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
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
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
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {image.directory}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchTableData(image)}
                  size="small"
                  sx={{ mt: 1 }}>
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
        }}
        fullWidth
        maxWidth="xs">
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
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsNewDirectoryDialogOpen(false);
              setError(null);
              setNewDirectoryName('');
            }}
            size="small">
            Cancel
          </Button>
          <Button onClick={handleNewDirectory} variant="contained" size="small">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
