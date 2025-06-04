//ChartColorCustom.tsx
import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';

import { ChartViewer } from './components/ChartViewer';
import { ChartTable } from './components/ChartTable';
import { Toolbar } from './components/Toolbar';
import { ChartSelector } from './components/ChartSelector';
import { MockDataService } from './services/mockDataService';
import { Chart, ChartData, ChartView, BarDirection, ShowColorPickerState } from './types';

// 부드러운 무지개 색상
const predefinedColors = [
  '#4CAF50',
  '#2196F3',
  '#FF5722',
  '#9C27B0',
  '#FF9800',
  '#607D8B',
  '#e57373',
  '#ffb74d',
  '#fff176',
  '#81c784',
  '#64b5f6',
  '#9575cd',
];

// HTML2Canvas를 위한 간단한 구현체
const html2canvas = async (element: HTMLElement, options: any = {}) => {
  return new Promise<HTMLCanvasElement>(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const rect = element.getBoundingClientRect();
    canvas.width = rect.width * (options.scale || 1);
    canvas.height = rect.height * (options.scale || 1);

    if (ctx) {
      ctx.scale(options.scale || 1, options.scale || 1);
      ctx.fillStyle = options.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // SVG를 캔버스로 변환하는 간단한 구현
      const svgElement = element.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          resolve(canvas);
        };

        img.src = url;
      } else {
        resolve(canvas);
      }
    } else {
      resolve(canvas);
    }
  });
};

export default function ChartColorCustom() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ChartView>('table');
  const [barDirection, setBarDirection] = useState<BarDirection>('vertical');
  const [tableData, setTableData] = useState<ChartData>({ headers: [], rows: [] });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [colors, setColors] = useState<string[]>([]);
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userCustomColors, setUserCustomColors] = useState<string[]>(['#FF6B6B', '#4ECDC4', '#45B7D1']);

  // 새로 추가된 그리드 간격 상태
  const [gridInterval, setGridInterval] = useState<number | 'auto'>('auto');
  const [gridIntervalInput, setGridIntervalInput] = useState<string>('auto');

  // 색상 선택기 표시 상태
  const [showColorPicker, setShowColorPicker] = useState<ShowColorPickerState>({});

  // Load available charts on component mount
  useEffect(() => {
    const loadCharts = async () => {
      setLoading(true);
      try {
        const charts = await MockDataService.getCharts();
        setAvailableCharts(charts);
        if (charts.length > 0) {
          setSelectedChartId(charts[0].id);
          loadChartData(charts[0]);
        }
      } catch (error) {
        console.error('Error loading charts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharts();
  }, []);

  // Load chart data
  const loadChartData = (chart: Chart) => {
    const convertedData: ChartData = {
      headers: chart.data.headers,
      rows: chart.data.rows.map(row => row.map(cell => String(cell))),
    };

    setTableData(convertedData);
    setShowGrid(chart.showGrid);

    // Set colors based on chart's primary and secondary colors
    const chartColors = [chart.colors.primary, chart.colors.secondary];
    const requiredColors = Math.max(1, chart.data.headers.length - 1);
    const newColors = [];

    for (let i = 0; i < requiredColors; i++) {
      if (i < chartColors.length) {
        newColors.push(chartColors[i]);
      } else {
        newColors.push(predefinedColors[i % predefinedColors.length]);
      }
    }

    setColors(newColors);
  };

  // Handle chart selection change
  const handleChartChange = async (chartId: string) => {
    setLoading(true);
    try {
      const chart = await MockDataService.getChartById(chartId);
      if (chart) {
        setSelectedChartId(chartId);
        loadChartData(chart);
      }
    } catch (error) {
      console.error('Error loading chart:', error);
    } finally {
      setLoading(false);
    }
  };

  // 그리드 간격 입력 처리
  const handleGridIntervalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGridIntervalInput(value);

    if (value === '' || value.toLowerCase() === 'auto') {
      setGridInterval('auto');
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        setGridInterval(numValue);
      }
    }
  };

  // 색상 선택기 토글
  const handleToggleColorPicker = (colorIndex: number) => {
    setShowColorPicker(prev => ({
      ...prev,
      [colorIndex]: !prev[colorIndex],
    }));
  };

  // 이미지 다운로드 처리
  const handleDownload = async () => {
    if (!chartRef.current) return;

    try {
      setLoading(true);
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // 고품질
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const selectedChart = availableCharts.find(c => c.id === selectedChartId);
      link.download = `${selectedChart?.name || 'chart'}-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error downloading chart:', error);
    } finally {
      setLoading(false);
    }
  };

  // 데이터 행 개수에 따라 필요한 색상 개수 계산
  const getRequiredColorCount = (): number => {
    if (view === 'pie') return tableData.rows.length;
    return Math.max(1, tableData.headers.length - 1);
  };

  // 색상 배열 길이를 데이터에 맞게 조정
  useEffect(() => {
    const requiredColors = getRequiredColorCount();
    if (colors.length < requiredColors) {
      const newColors = [...colors];
      for (let i = colors.length; i < requiredColors; i++) {
        newColors.push(predefinedColors[i % predefinedColors.length]);
      }
      setColors(newColors);
    }
  }, [tableData, view, colors.length]);

  // 새 행 추가
  const handleAddRow = () => {
    const newRow = tableData.headers.map(() => '');
    const newTableData: ChartData = {
      ...tableData,
      rows: [...tableData.rows, newRow],
    };
    setTableData(newTableData);
  };

  // 행 삭제
  const handleDeleteRow = (index: number) => {
    const newRows = tableData.rows.filter((_, i) => i !== index);
    const newTableData: ChartData = {
      ...tableData,
      rows: newRows,
    };
    setTableData(newTableData);
  };

  // 셀 편집
  const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;

    const newTableData: ChartData = {
      ...tableData,
      rows: newRows,
    };

    setTableData(newTableData);
  };

  // 색상 변경
  const handleColorChange = (colorIndex: number, color: string) => {
    const newColors = [...colors];
    newColors[colorIndex] = color;
    setColors(newColors);
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
        {/* 이미지 다운로드 버튼 */}
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

      {/* Chart Selection */}
      <ChartSelector charts={availableCharts} selectedChartId={selectedChartId} onChartChange={handleChartChange} />

      {/* Toolbar */}
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
        onToggleColorPicker={handleToggleColorPicker}
        onColorChange={handleColorChange}
        userCustomColors={userCustomColors}
        onUpdateUserCustomColors={setUserCustomColors}
      />

      <div className={`grid gap-6 ${view === 'table' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* 테이블 편집기 */}
        <ChartTable
          tableData={tableData}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onCellEdit={handleCellEdit}
        />

        {/* 차트 표시 영역 (테이블 뷰일 땐 숨김) */}
        {view !== 'table' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">차트 미리보기</h3>
            <div ref={chartRef}>
              <ChartViewer
                tableData={tableData}
                view={view}
                barDirection={barDirection}
                showGrid={showGrid}
                colors={colors}
                gridInterval={gridInterval}
              />
            </div>
          </div>
        )}
      </div>

      {/* 범례 */}
      {view !== 'table' && view !== 'pie' && tableData.headers.length > 1 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">범례</h4>
          <div className="flex flex-wrap gap-4">
            {tableData.headers.slice(1).map((header, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: colors[index] || predefinedColors[index % predefinedColors.length] }}
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
