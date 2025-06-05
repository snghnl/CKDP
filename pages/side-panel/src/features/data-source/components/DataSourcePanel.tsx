import React, { useState } from 'react';
import { useSourceData } from '../hooks/useSourceData';
import { SourceDisplay } from './SourceDisplay';
import { ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { CitationFormat } from '../types';

export const DataSourcePanel: React.FC = () => {
  const { sources, loading, error, updateSourceFormat, updateAllFormats } = useSourceData();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = async () => {
    try {
      // 차트와 출처를 포함하는 전체 컨테이너를 찾습니다
      const container = document.querySelector('.flex.flex-col.h-full') as HTMLElement;
      if (!container) return;

      // html2canvas를 사용하여 전체 컨테이너를 이미지로 캡처
      const canvas = await html2canvas(container, {
        scale: 2, // 고해상도 출력을 위해 2배 스케일 적용
        useCORS: true, // 외부 이미지 로딩 허용
        logging: false, // 로깅 비활성화
      });

      // 이미지를 다운로드
      const link = document.createElement('a');
      link.download = `chart-with-sources-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 내보내기 중 오류 발생:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 data-source-panel">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">전체 출처 형식:</label>
          <select
            onChange={e => updateAllFormats(e.target.value as CitationFormat)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="APA">APA</option>
            <option value="MLA">MLA</option>
            <option value="Chicago">Chicago</option>
            <option value="Harvard">Harvard</option>
            <option value="IEEE">IEEE</option>
          </select>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <ImageIcon size={20} />
          <span>이미지로 내보내기</span>
        </button>
      </div>

      <div className="space-y-4">
        {sources.map(source => (
          <SourceDisplay
            key={source.id}
            source={source}
            selectedFormat={source.selectedFormat || 'APA'}
            onFormatChange={format => updateSourceFormat(source.id, format)}
          />
        ))}
      </div>
    </div>
  );
};
