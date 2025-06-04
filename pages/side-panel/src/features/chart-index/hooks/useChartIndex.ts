import { useEffect, useState } from 'react';
import { Chart } from '../types';

export const useChartIndex = () => {
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'CHART_IMAGE_CLICKED') {
        const { id, imageUrl, name } = message.payload;
        setCharts(prev => {
          if (prev.some(chart => chart.imageUrl === imageUrl)) return prev;
          return [...prev, { id, name, imageUrl }];
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return { charts };
};
