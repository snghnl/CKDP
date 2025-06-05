import React from 'react';
import type { Chart } from '@extension/shared/types/chart';

interface Props {
  charts: Chart[];
  onSelect: (chart: Chart) => void;
}

export const ChartList = ({ charts, onSelect }: Props) => {
  if (!charts || charts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        선택된 이미지가 없습니다. 이미지 선택하기 버튼을 눌러 이미지를 선택해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {charts.map(chart => (
        <div
          key={chart.id}
          className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(chart)}>
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-medium mb-2">{chart.name}</h3>
            <div className="text-sm text-gray-600">
              <p>
                <strong>이미지 URL:</strong> {chart.imageUrl}
              </p>
              {chart.alt && (
                <p>
                  <strong>설명:</strong> {chart.alt}
                </p>
              )}
              {chart.metadata?.width && chart.metadata?.height && (
                <p>
                  <strong>크기:</strong> {chart.metadata.width} x {chart.metadata.height}
                </p>
              )}
            </div>
            <div className="mt-2">
              <img src={chart.imageUrl} alt={chart.alt || chart.name} className="max-w-full h-auto rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
