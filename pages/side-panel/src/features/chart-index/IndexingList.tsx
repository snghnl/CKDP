import React from 'react';
import { useState } from 'react';

import { Button } from '@mui/material';

export function IndexingList() {
  const [clickedButton, setClickedButton] = useState<boolean>(false);

  const handleClick = () => {
    setClickedButton(!clickedButton);
    if (clickedButton) {
      chrome.runtime.sendMessage({
        type: 'from_panel',
        action: 'activate-image-picker',
      });
      // test
      console.log('clickedButton', clickedButton);
    }
  };

  const [imageInfo, setImageInfo] = useState<any>(null);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'image-picked') {
      console.log('message.payload', message.payload);
      setImageInfo(message.payload);
      setClickedButton(false);
    }
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Button variant="contained" onClick={handleClick}>
          {clickedButton ? 'Stop' : 'Select Image'}
        </Button>
      </div>
      <div>
        <h5>Image Info</h5>
        <div>src: {imageInfo?.src}</div>
        <div>alt: {imageInfo?.alt}</div>
        <div>width: {imageInfo?.width}</div>
        <div>height: {imageInfo?.height}</div>
      </div>
      <div>directory</div>
    </>
  );
}
