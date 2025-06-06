//ChartSelector.tsx
import { Chart } from '../types';

interface ChartSelectorProps {
  charts: Chart[];
  selectedChartId: string;
  onChartChange: (chartId: string) => void;
}

export const ChartSelector = ({ charts, selectedChartId, onChartChange }: ChartSelectorProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">차트 선택:</label>
      <select
        value={selectedChartId}
        onChange={e => onChartChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        {charts.map(chart => (
          <option key={chart.id} value={chart.id}>
            {chart.name} - {chart.description}
          </option>
        ))}
      </select>
    </div>
  );
};
