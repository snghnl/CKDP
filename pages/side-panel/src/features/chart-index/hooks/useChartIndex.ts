import { useState, useEffect } from 'react';
import type { Chart } from '@extension/shared/types/chart';

export const useChartIndex = () => {
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    console.log('[Chart Index] Initializing hook');

    // 1. 초기 데이터 로드
    chrome.storage.local.get(['recentCharts'], result => {
      console.log('[Chart Index] Loaded charts from storage:', result.recentCharts);
      if (result.recentCharts) {
        setCharts(result.recentCharts);
      }
    });

    // 2. 메시지 리스너 설정
    const handleMessage = (message: any) => {
      console.log('[Chart Index] Received message:', message);

      if (message.type === 'CHART_IMAGE_CLICKED') {
        console.log('[Chart Index] Processing chart image click');
        const { id, imageUrl, name, alt } = message.payload;

        const newChart: Chart = {
          id,
          name: name || imageUrl.split('/').pop() || '이미지',
          imageUrl,
          alt,
          metadata: {
            alt,
          },
        };

        console.log('[Chart Index] Created new chart:', newChart);

        // 3. 상태 업데이트
        setCharts(prev => {
          const filtered = prev.filter(c => c.imageUrl !== imageUrl);
          const updated = [newChart, ...filtered].slice(0, 10);
          console.log('[Chart Index] Updated charts state:', updated);
          return updated;
        });

        // 4. 로컬 스토리지에 저장
        chrome.storage.local.get(['recentCharts'], result => {
          const currentCharts = result.recentCharts || [];
          const updatedCharts = [newChart, ...currentCharts.filter((c: Chart) => c.imageUrl !== imageUrl)].slice(0, 10);
          console.log('[Chart Index] Saving to storage:', updatedCharts);
          chrome.storage.local.set({ recentCharts: updatedCharts });
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return { charts };
};
