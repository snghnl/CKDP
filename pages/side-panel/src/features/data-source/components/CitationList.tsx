import React from 'react';
import { CitationListProps } from '../types';
import { SourceDisplay } from './SourceDisplay';
import { Download } from 'lucide-react';

export const CitationList: React.FC<CitationListProps> = ({ sources, selectedFormat, onFormatChange, onExport }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">출처 목록</h2>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          <Download size={18} />
          내보내기
        </button>
      </div>

      <div className="space-y-4">
        {sources.map(source => (
          <SourceDisplay
            key={source.id}
            source={source}
            selectedFormat={selectedFormat}
            onFormatChange={onFormatChange}
          />
        ))}
      </div>

      {sources.length === 0 && <div className="text-center py-8 text-gray-500">등록된 출처가 없습니다.</div>}
    </div>
  );
};
