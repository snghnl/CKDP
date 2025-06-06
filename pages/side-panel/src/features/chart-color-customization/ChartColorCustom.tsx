//ChartColorCustom.tsx
import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas'; // 설치된 html2canvas 라이브러리 임포트

import { ChartViewer } from './components/ChartViewer';
import { ChartTable } from './components/ChartTable';
import { Toolbar } from './components/Toolbar';
import { ChartSelector } from './components/ChartSelector';
import { MockDataService } from './services/mockDataService';
import { Chart, ChartData, ChartView, BarDirection } from '@extension/shared';
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

// 사용자 정의 html2canvas 구현 제거
// const html2canvas = async (element: HTMLElement, options: any = {}) => { ... };

export default function ChartColorCustom({ chart }: { chart: Chart }) {
  // ChartViewer 내부의 SVG 컨테이너를 위한 ref (제거합니다)
  // const chartSvgTargetRef = useRef<HTMLDivElement | null>(null);

  // 기존 chartRef를 복구합니다.
  const chartRef = useRef<HTMLDivElement>(null);

  // ChartViewer 내부의 실제 차트 컨테이너 DOM 요소를 저장할 상태 추가
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

  // 새로 추가된 그리드 간격 상태
  const [gridInterval, setGridInterval] = useState<number | 'auto'>('auto');
  const [gridIntervalInput, setGridIntervalInput] = useState<string>('auto');

  // 색상 선택기 표시 상태 (단일 boolean으로 변경)
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

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
    const requiredColors = Math.max(1, tableData.headers.length - 1);
    const newColors = [];

    for (let i = 0; i < requiredColors; i++) {
      if (i < chartColors.length && chartColors[i]) {
        // null 또는 undefined 체크 추가
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

  // 색상 선택기 토글 (단일 boolean 상태 토글로 변경)
  const handleToggleColorPicker = (show: boolean) => {
    setShowColorPicker(show);
  };

  // 이미지 다운로드 처리
  const handleDownload = async () => {
    // chartContainerElement를 사용하여 캡처 대상으로 변경
    if (!chartContainerElement) {
      console.error('Chart container element not found for download.');
      return;
    }

    try {
      setLoading(true);
      // 설치된 html2canvas 라이브러리 사용
      const canvas = await html2canvas(chartContainerElement, {
        // 대상 요소를 상태값으로 변경
        scale: 2, // 고품질
        backgroundColor: null, // 배경을 투명하게 설정
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
    // colors 배열 길이를 필요한 색상 개수와 맞추고, userCustomColors 또는 predefinedColors로 채움
    const newColors = Array(requiredColors)
      .fill(null)
      .map((_, i) => userCustomColors[i] || colors[i] || predefinedColors[i % predefinedColors.length]);
    // 실제 색상이 변경되었을 때만 상태 업데이트
    if (JSON.stringify(newColors) !== JSON.stringify(colors)) {
      setColors(newColors);
    }
  }, [tableData.headers.length, tableData.rows.length, view, userCustomColors, predefinedColors]); // 종속성 배열 업데이트

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

    // 사용자 지정 색상에도 추가 (선택적으로)
    if (!userCustomColors.includes(color)) {
      setUserCustomColors(prev => [...prev, color]);
    }
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
        onToggleColorPicker={() => handleToggleColorPicker(!showColorPicker)}
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
          // chartRef는 이 div에 그대로 연결 유지 (테이블 뷰 숨김/보기에 사용)
          <div ref={chartRef} className="bg-white border border-gray-200 rounded-lg p-4">
            {' '}
            {/* ref 유지 및 스타일 유지 */}
            <h3 className="text-lg font-semibold mb-4">차트 미리보기</h3>
            {/* ChartViewer에 onChartContainerReady prop 전달 */}
            <ChartViewer
              tableData={tableData}
              view={view}
              barDirection={barDirection}
              showGrid={showGrid}
              colors={colors}
              gridInterval={gridInterval}
              // chartSvgRef={chartSvgTargetRef} // <-- ref 전달 부분 제거
              onChartContainerReady={setChartContainerElement} // <-- 새로운 콜백 prop 전달
            />
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

      {/* 색상 선택기 */}
      {showColorPicker && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* ColorPicker 컴포넌트에 필요한 props 전달 */}
          <ColorPicker
            colorIndex={0} // 첫 번째 색상 인덱스 (예시)
            currentColor={colors[0] || predefinedColors[0]}
            onColorChange={handleColorChange}
            onClose={() => handleToggleColorPicker(false)}
            userCustomColors={userCustomColors}
          />
        </div>
      )}
    </div>
  );
}
