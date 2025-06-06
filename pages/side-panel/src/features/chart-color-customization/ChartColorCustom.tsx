//ChartColorCustom.tsx
import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas'; // 설치된 html2canvas 라이브러리 임포트

import { ChartViewer } from './components/ChartViewer';
import { ChartTable } from './components/ChartTable';
import { Toolbar } from './components/Toolbar';
import { ChartSelector } from './components/ChartSelector';
import { MockDataService } from './services/mockDataService';
import { ChartData, ChartView, BarDirection, Chart } from '@extension/shared';
import { ColorPicker } from './components/ColorPicker';
import { Paper } from '@mui/material';

// 부드러운 무지개 색상 (빨주노초 순서 반영 및 개선)
const predefinedColors = [
  '#FF6347', // 빨강 (Tomato)
  '#FF7F50', // 주황 (Coral)
  '#FFD700', // 노랑 (Gold)
  '#9ACD32', // 연두 (YellowGreen)
  '#66CDAA', // 초록 (MediumAquamarine)
  '#00CED1', // 청록 (DarkTurquoise)
  '#4682B4', // 파랑 (SteelBlue)
  '#8A2BE2', // 보라 (BlueViolet)
  '#FF69B4', // 분홍 (HotPink)
  '#E9967A', // 주황빛 갈색 (DarkSalmon)
  '#ADFF2F', // 연두색 (GreenYellow)
  '#1E90FF', // 파란색 (DodgerBlue)
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
  const [tableData, setTableData] = useState<ChartData>({
    headers: ['Category', 'Value'],
    rows: [['', '']],
  });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [colors, setColors] = useState<string[]>([]);
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userCustomColors, setUserCustomColors] = useState<string[]>(['#FF6B6B', '#4ECDC4', '#45B7D1']);

  // 색상 편집 상태를 추적하는 새로운 상태 추가
  const [hasCustomColorEdits, setHasCustomColorEdits] = useState<boolean>(false);
  const [editedColorIndices, setEditedColorIndices] = useState<Set<number>>(new Set());

  // 새로 추가된 그리드 간격 상태
  const [gridInterval, setGridInterval] = useState<number | 'auto'>('auto');
  const [gridIntervalInput, setGridIntervalInput] = useState<string>('auto');

  // 색상 선택기 표시 상태 (단일 boolean으로 변경)
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [selectedSeriesIndex, setSelectedSeriesIndex] = useState<number | null>(null);

  // Load available charts on component mount
  useEffect(() => {
    const loadCharts = async () => {
      setLoading(true);
      try {
        // Check if the chart already exists in availableCharts
        const chartExists = availableCharts.some(c => c.id === chart.id);

        if (!chartExists) {
          // Add new chart to the list if it doesn't exist
          setAvailableCharts(prevCharts => [...prevCharts, chart]);
        }

        // Set the current chart as selected and load its data
        setSelectedChartId(chart.id);
        loadChartData(chart);
      } catch (error) {
        console.error('Error loading charts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharts();
  }, [chart]);

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
    const requiredColors = Math.max(1, convertedData.headers.length - 1);
    const newColors = [];

    for (let i = 0; i < requiredColors; i++) {
      if (i < chartColors.length && chartColors[i]) {
        newColors.push(chartColors[i]);
      } else {
        newColors.push(predefinedColors[i % predefinedColors.length]);
      }
    }

    setColors(newColors);
    // 새 차트 로드 시 편집 상태 초기화
    setHasCustomColorEdits(false);
    setEditedColorIndices(new Set());
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

  // 색상 선택기 토글 (단일 boolean 상태 토글로 변경)
  const handleToggleColorPicker = (show: boolean) => {
    setShowColorPicker(show);
  };

  // 이미지 다운로드 처리
  const handleDownload = async () => {
    if (!chartContainerElement) {
      console.error('Chart container element not found for download.');
      return;
    }

    try {
      setLoading(true);
      const canvas = await html2canvas(chartContainerElement, {
        scale: 2,
        backgroundColor: null,
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

  // 색상 배열 길이를 데이터에 맞게 조정 (수정된 부분)
  useEffect(() => {
    const requiredColors = getRequiredColorCount();

    // 필요한 색상 개수가 현재 색상 배열보다 많을 때만 확장
    if (requiredColors > colors.length) {
      const newColors = [...colors];

      // 부족한 색상만 추가 (기존 색상은 유지)
      for (let i = colors.length; i < requiredColors; i++) {
        newColors.push(userCustomColors[i] || predefinedColors[i % predefinedColors.length]);
      }

      setColors(newColors);
    }
    // 필요한 색상 개수가 적을 때는 배열을 줄이되, 편집된 색상은 보존
    else if (requiredColors < colors.length) {
      setColors(colors.slice(0, requiredColors));
      // 편집된 인덱스도 업데이트
      setEditedColorIndices(prev => {
        const newSet = new Set(prev);
        // requiredColors보다 큰 인덱스는 제거
        for (const index of newSet) {
          if (index >= requiredColors) {
            newSet.delete(index);
          }
        }
        return newSet;
      });
    }
  }, [tableData.headers.length, tableData.rows.length, view]); // userCustomColors, predefinedColors 제거

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

  // 색상 변경 (수정된 부분)
  const handleColorChange = (colorIndex: number, color: string) => {
    const newColors = [...colors];
    newColors[colorIndex] = color;
    setColors(newColors);

    // 편집된 색상 인덱스 추가
    setEditedColorIndices(prev => new Set(prev).add(colorIndex));
    setHasCustomColorEdits(true);
  };

  // 시리즈 클릭 시
  const handleSeriesSelect = (index: number) => {
    setSelectedSeriesIndex(index);
    setShowColorPicker(true);
  };

  console.log('Rendering ChartViewer conditional block', {
    view,
    tableData: tableData?.headers?.length > 0 ? 'Data available' : 'No data or empty headers',
  });

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
        onToggleColorPicker={() => handleToggleColorPicker(!showColorPicker)}
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
          <div ref={chartRef} className="bg-white border border-gray-200 rounded-lg p-4">
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
          </div>
        )}
      </div>

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

      {showColorPicker && (
        <div className="mt-4 pt-4 border-t border-gray-100">
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
  );
}
