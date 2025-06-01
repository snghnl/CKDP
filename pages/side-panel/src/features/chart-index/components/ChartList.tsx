import React from 'react';
import { Chart } from '../types';

interface Props {
  charts: Chart[];
  onClick: (position: number) => void;
}

export const ChartList = ({ charts, onClick }: Props) => {
  return (
    <div className="text-sm h-1/3 overflow-hidden">
      {/* ⬆️ 내부 스크롤 가능, 높이 제한 */}
      <ul className="space-y-2 h-full overflow-y-auto pr-1 border rounded-md p-2 bg-white dark:bg-gray-800">
        {charts.map(chart => (
          <li
            key={chart.id}
            className="flex flex-col items-center gap-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => onClick(chart.position)}>
            <div className="relative w-[80px] h-[60px] border rounded overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full bg-black bg-opacity-60 text-white text-[10px] px-1 truncate text-center z-10"
                title={decodeHtml(chart.title)}
                onClick={e => {
                  e.stopPropagation();
                  onClick(chart.position);
                }}>
                {decodeHtml(chart.title)}
              </div>
              <img
                src={chart.src}
                alt={chart.title}
                className="w-full h-full object-contain bg-white"
                onError={e => {
                  e.currentTarget.src = 'fallback-thumbnail.png';
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function decodeHtml(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}
