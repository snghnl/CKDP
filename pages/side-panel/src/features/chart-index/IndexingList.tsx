import React from 'react';
import { useState, useEffect, useCallback } from 'react';

import { Button } from '@mui/material';

interface MessageResponse {
  success: boolean;
  error?: string;
}

export function IndexingList() {
  const [clickedButton, setClickedButton] = useState<boolean>(false);
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImagePicked = useCallback((message: any) => {
    if (message.type === 'image-picked') {
      console.log('message.payload', message.payload);
      setImageInfo(message.payload);
      setClickedButton(false);
      setError(null);
    }
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleImagePicked);
    return () => {
      chrome.runtime.onMessage.removeListener(handleImagePicked);
    };
  }, [handleImagePicked]);

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

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Button variant="contained" onClick={handleClick} color={error ? 'error' : 'primary'}>
          {clickedButton ? 'Stop' : 'Select Image'}
        </Button>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{error}</div>}
      {imageInfo && (
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
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
        </div>
      )}
      <div>directory</div>
    </>
  );
}
