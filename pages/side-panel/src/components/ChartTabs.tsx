import React, { useState } from 'react';

const chartTypes = [
  { key: 'bar', label: 'Bar' },
  { key: 'line', label: 'Line' },
  { key: 'area', label: 'Area' },
  { key: 'pie', label: 'Pie' },
  { key: 'groupedBar', label: 'Grouped Bar' },
];

interface ChartTypeTabsProps {
  selectedType: string;
  onChange: (type: string) => void;
}

const ChartTypeTabs: React.FC<ChartTypeTabsProps> = ({ selectedType, onChange }) => {
  return (
    <div className="flex gap-2 border-b mb-4">
      {chartTypes.map(({ key, label }) => (
        <button
          key={key}
          className={`px-3 py-1 text-sm border-b-2 transition-colors duration-150 font-medium ${
            selectedType === key ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
          }`}
          onClick={() => onChange(key)}>
          {label}
        </button>
      ))}
    </div>
  );
};

export default ChartTypeTabs;
