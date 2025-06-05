import React, { useState, useEffect } from 'react';
import { useChartIndex } from '../hooks/useChartIndex';
import { ChartList } from './ChartList';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ChartIndexPanel Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          <h2 className="text-lg font-bold mb-2">오류가 발생했습니다</h2>
          <p>페이지를 새로고침해주세요.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ChartIndexPanel = () => {
  const { charts } = useChartIndex();
  const [selectMode, setSelectMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChartClick = (chart: any) => {
    try {
      console.log(`Customization requested for: ${chart.name}`);
      // TODO: chart-customization 연동 예정
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    }
  };

  const handleActivateSelection = () => {
    try {
      if (selectMode) {
        chrome.runtime.sendMessage({ type: 'DISABLE_IMAGE_SELECT' });
      } else {
        chrome.runtime.sendMessage({ type: 'ENABLE_IMAGE_SELECT' });
      }
      setSelectMode(mode => !mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : '메시지 전송 중 오류가 발생했습니다');
    }
  };

  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === 'CHART_IMAGE_CLICKED') {
        setSelectMode(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  return (
    <ErrorBoundary>
      <div className="p-4 bg-gradient-to-b from-white to-gray-50 min-h-screen">
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg shadow-sm">{error}</div>}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">차트 인덱스</h2>

          <button
            onClick={handleActivateSelection}
            className={`
              w-full mb-4 px-6 py-4 rounded-xl font-medium
              transition-all duration-300 ease-in-out
              flex items-center justify-center gap-3
              ${
                selectMode
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200'
              }
              shadow-lg hover:shadow-xl
              transform hover:scale-[1.02]
              active:scale-[0.98]
              relative overflow-hidden
              group
            `}>
            <div
              className={`
              absolute inset-0 bg-gradient-to-r
              ${selectMode ? 'from-red-400 to-red-500' : 'from-blue-400 to-blue-500'}
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            `}
            />

            <span
              className={`
              text-2xl relative z-10
              ${selectMode ? 'animate-pulse' : ''}
            `}>
              {selectMode ? '✕' : '📷'}
            </span>

            <span className="relative z-10 text-lg">{selectMode ? '이미지 선택 해제' : '이미지 선택하기'}</span>

            {selectMode && <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse" />}
          </button>

          {selectMode && (
            <div className="text-center text-sm text-gray-600 mb-4">웹페이지에서 선택하고 싶은 이미지를 클릭하세요</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <ChartList charts={charts} onSelect={handleChartClick} />
        </div>
      </div>
    </ErrorBoundary>
  );
};
