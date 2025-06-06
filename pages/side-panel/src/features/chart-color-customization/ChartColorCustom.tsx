// ChartColorCustom.tsx
import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';

import { ChartViewer } from './components/ChartViewer';
import { ChartTable } from './components/ChartTable';
import { Toolbar } from './components/Toolbar';
import { ChartSelector } from './components/ChartSelector';
import { MockDataService } from './services/mockDataService';
import { ChartData, ChartView, BarDirection, Chart } from '@extension/shared';
import { ColorPicker } from './components/ColorPicker';

const predefinedColors = [
  '#FF6347',
  '#FF7F50',
  '#FFD700',
  '#9ACD32',
  '#66CDAA',
  '#00CED1',
  '#4682B4',
  '#8A2BE2',
  '#FF69B4',
  '#E9967A',
  '#ADFF2F',
  '#1E90FF',
];

interface ChartColorCustomProps {
  chart: Chart;
  setChart?: (chart: Chart) => void;
}

export default function ChartColorCustom({ chart, setChart }: ChartColorCustomProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartContainerElement, setChartContainerElement] = useState<HTMLDivElement | null>(null);

  const [view, setView] = useState<ChartView>('table');
  const [barDirection, setBarDirection] = useState<BarDirection>('vertical');
  const [tableData, setTableData] = useState<ChartData>({ headers: ['Category', 'Value'], rows: [['', '']] });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [colors, setColors] = useState<string[]>([]);
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userCustomColors, setUserCustomColors] = useState<string[]>(['#FF6B6B', '#4ECDC4', '#45B7D1']);
  const [hasCustomColorEdits, setHasCustomColorEdits] = useState<boolean>(false);
  const [editedColorIndices, setEditedColorIndices] = useState<Set<number>>(new Set());

  const [gridInterval, setGridInterval] = useState<number | 'auto'>('auto');
  const [gridIntervalInput, setGridIntervalInput] = useState<string>('auto');

  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState<number | null>(null);

  // 초기 차트 로드
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        setSelectedChartId(chart.id);
        setAvailableCharts(prev => (prev.some(c => c.id === chart.id) ? prev : [...prev, chart]));
        loadChartData(chart);
      } catch (err) {
        console.error('Error during initial load:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [chart]);

  // ChartData 로드
  const loadChartData = (chart: Chart) => {
    const data: ChartData = {
      headers: chart.data.headers,
      rows: chart.data.rows.map(row => row.map(cell => String(cell))),
    };

    setTableData(data);
    setShowGrid(chart.showGrid);

    const chartColors = [chart.colors.primary, chart.colors.secondary];
    const required = Math.max(1, data.headers.length - 1);
    const newColors: string[] = [];

    for (let i = 0; i < required; i++) {
      newColors.push(chartColors[i] || predefinedColors[i % predefinedColors.length]);
    }

    setColors(newColors);
    setHasCustomColorEdits(false);
    setEditedColorIndices(new Set());
  };

  // 차트 선택 핸들러
  const handleChartChange = async (chartId: string) => {
    setLoading(true);
    try {
      if (chartId === chart.id) {
        // new chart 다시 선택한 경우
        loadChartData(chart);
        setSelectedChartId(chartId);
        return;
      }

      const foundChart = await MockDataService.getChartById(chartId);
      if (foundChart) {
        setSelectedChartId(chartId);
        loadChartData(foundChart);
      }
    } catch (err) {
      console.error('Error loading selected chart:', err);
    } finally {
      setLoading(false);
    }
  };

  // 그리드 간격 입력 처리
  const handleGridIntervalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGridIntervalInput(val);
    if (val === '' || val.toLowerCase() === 'auto') {
      setGridInterval('auto');
    } else {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed > 0) setGridInterval(parsed);
    }
  };

  // 이미지 다운로드
  const handleDownload = async () => {
    if (!chartContainerElement) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(chartContainerElement, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const chartName = availableCharts.find(c => c.id === selectedChartId)?.name || 'chart';
      link.download = `${chartName}-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 색상 개수 자동 조절
  useEffect(() => {
    const required = getRequiredColorCount();
    if (required > colors.length) {
      const extended = [...colors];
      for (let i = colors.length; i < required; i++) {
        extended.push(userCustomColors[i] || predefinedColors[i % predefinedColors.length]);
      }
      setColors(extended);
    } else if (required < colors.length) {
      setColors(colors.slice(0, required));
      setEditedColorIndices(prev => {
        const newSet = new Set(prev);
        for (const i of newSet) if (i >= required) newSet.delete(i);
        return newSet;
      });
    }
  }, [tableData.headers.length, tableData.rows.length, view]);

  const getRequiredColorCount = (): number =>
    view === 'pie' ? tableData.rows.length : Math.max(1, tableData.headers.length - 1);

  const handleAddRow = () =>
    setTableData(prev => ({
      ...prev,
      rows: [...prev.rows, prev.headers.map(() => '')],
    }));

  const handleDeleteRow = (index: number) =>
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index),
    }));

  const handleCellEdit = (row: number, col: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[row] = [...newRows[row]];
    newRows[row][col] = value;
    setTableData({ ...tableData, rows: newRows });
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
    setEditedColorIndices(prev => new Set(prev).add(index));
    setHasCustomColorEdits(true);
  };

  const handleSeriesSelect = (index: number) => {
    setSelectedSeriesIndex(index);
    setShowColorPicker(true);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin mr-2" />
          <span>데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">MockData 차트 커스터마이징</h2>
        {view !== 'table' && (
          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50">
            <Download size={16} />
            {loading ? '다운로드 중...' : '이미지 다운로드'}
          </button>
        )}
      </div>

      <ChartSelector charts={availableCharts} selectedChartId={selectedChartId} onChartChange={handleChartChange} />

      <Toolbar
        view={view}
        onViewChange={setView}
        barDirection={barDirection}
        onBarDirectionChange={setBarDirection}
        showGrid={showGrid}
        onShowGridChange={setShowGrid}
        gridInterval={gridInterval}
        gridIntervalInput={gridIntervalInput}
        onGridIntervalInputChange={handleGridIntervalInputChange}
        colors={colors}
        requiredColorCount={getRequiredColorCount()}
        showColorPicker={showColorPicker}
        onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
        onColorChange={handleColorChange}
        userCustomColors={userCustomColors}
        onUpdateUserCustomColors={setUserCustomColors}
      />

      <div className={`grid gap-6 ${view === 'table' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        <ChartTable
          tableData={tableData}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onCellEdit={handleCellEdit}
        />
        {view !== 'table' && (
          <div ref={chartRef} className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <h3 className="text-lg font-semibold mb-4">차트 미리보기</h3>
            <ChartViewer
              tableData={tableData}
              view={view}
              barDirection={barDirection}
              showGrid={showGrid}
              colors={colors}
              gridInterval={gridInterval}
              onChartContainerReady={setChartContainerElement}
              onSeriesSelect={handleSeriesSelect}
            />

            {/* 색상 선택기 - 그래프 내부 아래쪽에 표시 */}
            {/* 색상 선택기 - 그래프 내부 오버레이로 표시 */}
            {showColorPicker && (
              <div className="absolute top-32 left-4 z-10">
                <ColorPicker
                  show={showColorPicker}
                  onClose={() => setShowColorPicker(false)}
                  onColorChange={color => {
                    if (selectedSeriesIndex !== null) {
                      handleColorChange(selectedSeriesIndex, color);
                    }
                  }}
                  selectedColor={selectedSeriesIndex !== null ? colors[selectedSeriesIndex] : undefined}
                  userCustomColors={userCustomColors}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {view !== 'table' && view !== 'pie' && tableData.headers.length > 1 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">범례</h4>
          <div className="flex flex-wrap gap-4">
            {tableData.headers.slice(1).map((header, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: colors[i] || predefinedColors[i % predefinedColors.length] }}
                />
                <span className="text-sm">{header}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
