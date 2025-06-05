import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface ChartImage {
  id: string;
  name: string;
  imageUrl: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

export function IndexingList() {
  const [selectedImages, setSelectedImages] = useState<ChartImage[]>([]);

  useEffect(() => {
    // 메시지 수신 리스너 설정
    const messageListener = (message: any) => {
      if (message.type === 'CHART_IMAGE_CLICKED') {
        setSelectedImages(prev => [message.payload, ...prev]);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {selectedImages.map(image => (
        <Card key={image.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{image.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {image.alt || 'No alt text'}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <img
                src={image.imageUrl}
                alt={image.alt}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '200px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Size: {image.width}x{image.height}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
