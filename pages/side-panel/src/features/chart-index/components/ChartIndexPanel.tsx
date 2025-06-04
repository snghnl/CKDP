import React from 'react';
import { useChartIndex } from '../hooks/useChartIndex';
import { ChartList } from './ChartList';

export const ChartIndexPanel = () => {
  const { charts } = useChartIndex();

  const handleChartClick = (chart: any) => {
    console.log(`Customization requested for: ${chart.name}`);
    // TODO: chart-customization 연동 예정
  };

  const handleActivateSelection = () => {
    chrome.runtime.sendMessage({ type: 'ENABLE_IMAGE_SELECT' });
    console.log('[Material Picker] 요청: 이미지 선택 모드 활성화');
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2">📊 차트 인덱스</h2>

      <button onClick={handleActivateSelection} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        이미지 선택하기
      </button>

      <ChartList charts={charts} onSelect={handleChartClick} />
    </div>
  );
};
