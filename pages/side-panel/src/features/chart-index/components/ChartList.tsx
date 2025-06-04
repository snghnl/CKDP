import React from 'react';
import { Chart } from '../types';

interface Props {
  charts: Chart[];
  onSelect: (chart: Chart) => void;
}

export const ChartList = ({ charts, onSelect }: Props) => {
  return (
    <div className="p-4 text-sm">
      <h2 className="text-lg font-bold mb-2">📊 차트 인덱스</h2>
      <ul className="space-y-2">
        {charts.map(chart => (
          <li
            key={chart.id}
            className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => onSelect(chart)}>
            <div className="font-medium">• {chart.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
