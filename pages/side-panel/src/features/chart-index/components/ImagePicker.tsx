import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

interface MessageResponse {
  success: boolean;
  error?: string;
}

interface ImagePickerProps {
  onImagePicked: (imageInfo: any) => void;
}

export function ImagePicker({ onImagePicked }: ImagePickerProps) {
  const [clickedButton, setClickedButton] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setError(null);
      const newState = !clickedButton;
      setClickedButton(newState);

      if (newState) {
        const response = await new Promise<MessageResponse>(resolve => {
          chrome.runtime.sendMessage(
            {
              type: 'from_panel',
              action: 'activate-image-picker',
            },
            response => {
              if (chrome.runtime.lastError) {
                resolve({ success: false, error: chrome.runtime.lastError.message });
              } else {
                resolve(response as MessageResponse);
              }
            },
          );
        });

        if (!response.success) {
          setError(response.error || 'Failed to activate image picker');
          setClickedButton(false);
        }
      }
    } catch (error) {
      console.error('Error handling click:', error);
      setError('Failed to communicate with content script');
      setClickedButton(false);
    }
  };

  React.useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === 'image-picked') {
        console.log('message.payload', message.payload);
        onImagePicked(message.payload);
        setClickedButton(false);
        setError(null);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [onImagePicked]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" onClick={handleClick} color={error ? 'error' : 'primary'}>
          {clickedButton ? 'Stop' : 'Select Image'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {'새로고침을 해주세요.'}
        </Typography>
      )}
    </Box>
  );
}
