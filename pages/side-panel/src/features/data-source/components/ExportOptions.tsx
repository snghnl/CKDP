import React from 'react';
import { ExportOptionsProps } from '../types';
import { FileText, FileJson, FileSpreadsheet } from 'lucide-react';

export const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport, availableFormats }) => {
  const formatIcons = {
    text: <FileText size={20} />,
    json: <FileJson size={20} />,
    csv: <FileSpreadsheet size={20} />,
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">내보내기 형식 선택</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableFormats.map(format => (
          <button
            key={format}
            onClick={() => onExport(format)}
            className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-blue-500 mb-2">
              {formatIcons[format as keyof typeof formatIcons] || <FileText size={20} />}
            </div>
            <span className="text-sm font-medium text-gray-700">{format.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
