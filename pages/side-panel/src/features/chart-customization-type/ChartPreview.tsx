import React, { useEffect, useRef, useState } from 'react';
import * as Plot from '@observablehq/plot';
import { MockDataService } from '../../services/mock-data-service';
import type { Chart } from '../../utils/shared-types';
// Import specific marks
// import { arc } from '@observablehq/plot'; // Corrected import - Removed due to library version incompatibility
import PieChartD3 from './PieChartD3'; // Import the new D3 Pie Chart component

type ChartType = 'bar' | 'line' | 'area' | 'pie';

interface ChartData {
  headers: string[];
  rows: (string | number)[][];
}

const ChartPreview: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedType, setSelectedType] = useState<ChartType>('bar');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [showTable, setShowTable] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    async function loadCharts() {
      const loadedCharts = await MockDataService.getCharts();
      console.log('📦 loaded charts:', loadedCharts);
      setCharts(loadedCharts);
      // 초기 차트 데이터 설정
      setChartData(selectedType === 'pie' ? loadedCharts[1].data : loadedCharts[0].data);
    }

    loadCharts();
  }, []);

  // Measure the width of the chart container
  useEffect(() => {
    const measureWidth = () => {
      // Measure the width of the parent container of the chartRef div
      if (chartRef.current && chartRef.current.parentElement) {
        setContainerWidth(chartRef.current.parentElement.clientWidth);
      }
    };

    measureWidth(); // Measure initially
    window.addEventListener('resize', measureWidth); // Remeasure on window resize

    return () => {
      window.removeEventListener('resize', measureWidth);
    };
  }, [chartRef]);

  // 차트 타입이 변경될 때 적절한 데이터 선택
  useEffect(() => {
    if (charts.length === 0) return;
    setChartData(selectedType === 'pie' ? charts[1].data : charts[0].data);
  }, [selectedType, charts]);

  const handleCellEdit = (row: number, col: number, value: string | number) => {
    if (!chartData) return;

    const newRows = [...chartData.rows];
    newRows[row] = [...newRows[row]];
    newRows[row][col] = value;

    setChartData({
      ...chartData,
      rows: newRows,
    });
  };

  const handleHeaderEdit = (col: number, value: string) => {
    if (!chartData) return;

    const newHeaders = [...chartData.headers];
    newHeaders[col] = value;

    setChartData({
      ...chartData,
      headers: newHeaders,
    });
  };

  // Add Row Function
  const handleAddRow = () => {
    if (!chartData) return;
    // Create a new row with default values based on the number of headers
    const newRow: (string | number)[] = chartData.headers.map(() => '');
    setChartData({
      ...chartData,
      rows: [...chartData.rows, newRow],
    });
  };

  // Delete Row Function
  const handleDeleteRow = (rowIndex: number) => {
    if (!chartData) return;
    const newRows = chartData.rows.filter((_, index) => index !== rowIndex);
    setChartData({
      ...chartData,
      rows: newRows,
    });
  };

  useEffect(() => {
    // Clear previous chart when selectedType or chartData changes
    if (chartRef.current) {
      // For Plot.js charts, remove the appended element
      while (chartRef.current.firstChild) {
        chartRef.current.removeChild(chartRef.current.firstChild);
      }
    }

    if (!chartData || !chartRef.current || selectedType === 'pie') return; // Skip Plot.js rendering for pie chart

    const { headers, rows } = chartData;
    const [xKey, ...yKeys] = headers;

    let plotElement: HTMLElement | SVGSVGElement | undefined;

    console.log('📊 selectedType:', selectedType);

    switch (selectedType) {
      case 'bar':
        plotElement = Plot.plot({
          y: { grid: true },
          marks: yKeys.map((yKey: string) =>
            Plot.barY(
              rows.map(row => ({
                [xKey]: row[0],
                [yKey]: row[headers.indexOf(yKey)],
              })),
              {
                x: xKey,
                y: yKey,
                fill: '#1f77b4',
                tip: true,
                title: (d: any) => `${yKey}: ${d[yKey]}`, // Update title format
              },
            ),
          ),
          width: containerWidth > 0 ? containerWidth : undefined, // Use measured width
          height: 400, // Use fixed height
        }) as HTMLElement;
        break;
      case 'line':
        plotElement = Plot.plot({
          y: { grid: true },
          marks: yKeys.map((yKey: string) =>
            Plot.line(
              rows.map(row => ({
                [xKey]: row[0],
                [yKey]: row[headers.indexOf(yKey)],
              })),
              {
                x: xKey,
                y: yKey,
                stroke: '#1f77b4',
                tip: true,
              },
            ),
          ),
          width: containerWidth > 0 ? containerWidth : undefined, // Use measured width
          height: 400, // Use fixed height
        }) as HTMLElement;
        break;
      case 'area':
        plotElement = Plot.plot({
          y: { grid: true },
          marks: yKeys.map((yKey: string) =>
            Plot.areaY(
              rows.map(row => ({
                [xKey]: row[0],
                [yKey]: row[headers.indexOf(yKey)],
              })),
              {
                x: xKey,
                y: yKey,
                fill: '#1f77b4',
                tip: true,
              },
            ),
          ),
          width: containerWidth > 0 ? containerWidth : undefined, // Use measured width
          height: 400, // Use fixed height
        }) as HTMLElement;
        break;
    }

    console.log('📈 plotElement:', plotElement);

    if (plotElement) {
      chartRef.current.appendChild(plotElement);
    } else {
      // This case should ideally not be reached for supported types
      chartRef.current.innerHTML = '⚠️ 그래프를 렌더링할 수 없습니다.';
    }

    return () => {
      // Cleanup function to remove the chart when component unmounts or effect re-runs
      if (chartRef.current) {
        // For Plot.js charts, remove the appended element
        while (chartRef.current.firstChild) {
          chartRef.current.removeChild(chartRef.current.firstChild);
        }
      }
      // D3 chart cleanup is handled within PieChartD3's own useEffect
    };
  }, [chartData, selectedType, containerWidth]); // Added containerWidth to dependencies

  // Prepare data for PieChartD3
  const pieChartD3Data =
    chartData && selectedType === 'pie'
      ? chartData.rows.map(row => ({
          name: String(row[0]), // Assuming the first column is the category name
          value: Number(row[1]), // Assuming the second column is the value
        }))
      : [];

  return (
    <div className="p-4">
      {/* Placeholder for Index section */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold">Index</h2>
        {/* Content for Index section would go here */}
      </div>

      {/* Customize section */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Customize</h2>
        {/* Content below Customize title will be in a scrollable area */}
        <div className="max-h-[500px] overflow-y-auto pr-2">
          {' '}
          {/* Added max height and overflow */}
          <div className="flex gap-2 mb-4">
            {(['bar', 'line', 'area', 'pie'] as ChartType[]).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded ${
                  selectedType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setShowTable(!showTable)} className="px-3 py-1 rounded bg-gray-200 text-gray-700 mb-4">
            {showTable ? '데이터 숨기기' : '데이터 편집'}
          </button>
          {showTable && chartData && (
            <div className="overflow-x-auto mb-4">
              {' '}
              {/* Added mb-4 for spacing */}
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {chartData.headers.map((header, colIndex) => (
                      <th key={colIndex} className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={header}
                          onChange={e => handleHeaderEdit(colIndex, e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                      </th>
                    ))}
                    {/* Header for Delete button column */}
                    <th className="border border-gray-300 p-2 w-16"></th> {/* Added header for delete column */}
                  </tr>
                </thead>
                <tbody>
                  {chartData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 p-2">
                          {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                            <input
                              type="text"
                              value={editingValue}
                              onChange={e => setEditingValue(e.target.value)}
                              onBlur={() => {
                                handleCellEdit(rowIndex, colIndex, editingValue);
                                setEditingCell(null);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  handleCellEdit(rowIndex, colIndex, editingValue);
                                  setEditingCell(null);
                                }
                              }}
                              className="w-full p-1 border rounded"
                              autoFocus
                            />
                          ) : (
                            <div
                              onClick={() => {
                                setEditingCell({ row: rowIndex, col: colIndex });
                                setEditingValue(String(cell));
                              }}
                              className="cursor-pointer hover:bg-gray-100 p-1 rounded">
                              {cell}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="border border-gray-300 p-2 w-16">
                        {' '}
                        {/* Added width to td */}
                        <button
                          onClick={() => handleDeleteRow(rowIndex)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleAddRow} className="px-3 py-1 mt-2 rounded bg-blue-500 text-white">
                행 추가
              </button>
            </div>
          )}
          {/* Render D3 Pie Chart separately */} {/* Render Plot.js charts in the chartRef div */}
          {selectedType === 'pie' && pieChartD3Data.length > 0 && containerWidth > 0 ? (
            <PieChartD3 data={pieChartD3Data} width={containerWidth} height={400} />
          ) : selectedType !== 'pie' ? (
            <div ref={chartRef} className="w-full h-[400px]" />
          ) : (
            // Placeholder for when pie chart is selected but data is not ready or width is 0
            <div className="w-full h-[400px] flex items-center justify-center text-gray-500">
              {chartData && pieChartD3Data.length === 0 ? '파이 차트 데이터가 없습니다.' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for Source section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h2 className="text-lg font-bold">Source</h2>
        {/* Content for Source section would go here */}
      </div>
    </div>
  );
};

export default ChartPreview;
