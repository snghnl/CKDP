import { useEffect, useState } from 'react';
import { Chart } from '../types';

export function useChartIndex() {
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    // ✅ 일반 메시지 수신 (background → side-panel)
    const handler = (message: any) => {
      if (message.type === 'CHARTS_DETECTED') {
        console.log('[side-panel] onMessage 수신:', message.charts.length);
        setCharts(message.charts);
      }
    };
    chrome.runtime.onMessage.addListener(handler);

    // ✅ background에 연결 → 초기 차트 요청
    const port = chrome.runtime.connect({ name: 'sidepanel-init' });
    port.onMessage.addListener(message => {
      if (message.type === 'CHARTS_DETECTED') {
        console.log('[side-panel] 포트 통해 수신:', message.charts.length);
        setCharts(message.charts);
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(handler);
    };
  }, []);

  const scrollToChart = (position: number) => {
    chrome.runtime.sendMessage({
      type: 'SCROLL_TO_CHART',
      position,
    });
  };

  return { charts, scrollToChart };
}
