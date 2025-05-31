import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Palette, Plus, Trash2, RotateCcw, Download, RefreshCw } from 'lucide-react';

// Type definitions from the mock data service
interface Image {
  id: string;
  url: string;
  description?: string;
  width: number;
  height: number;
  pageUrl: string;
  captureTimestamp: number;
  boundingRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface Chart {
  id: string;
  name: string;
  description: string;
  image: Image;
  type: string;
  data: {
    headers: string[];
    rows: (string | number)[][];
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  showLegend: boolean;
  showGrid: boolean;
  showLabels: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ChartData {
  headers: string[];
  rows: string[][];
}

type ChartView = 'table' | 'bar' | 'line' | 'area' | 'pie';
type BarDirection = 'vertical' | 'horizontal';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

interface ShowColorPickerState {
  [key: number]: boolean;
}

// Mock data from the first file
const mockImages: Image[] = [
  {
    id: 'img1',
    url: 'https://example.com/chart1.png',
    description: 'Monthly sales chart for Q1 2024',
    width: 800,
    height: 600,
    pageUrl: 'https://example.com/sales-report',
    captureTimestamp: Date.now(),
    boundingRect: {
      top: 100,
      left: 50,
      width: 800,
      height: 600,
    },
  },
  {
    id: 'img2',
    url: 'https://example.com/chart2.png',
    description: 'Revenue growth comparison',
    width: 600,
    height: 400,
    pageUrl: 'https://example.com/revenue-analysis',
    captureTimestamp: Date.now(),
    boundingRect: {
      top: 200,
      left: 100,
      width: 600,
      height: 400,
    },
  },
];

const mockCharts: Chart[] = [
  {
    id: 'chart1',
    name: 'Q1 Sales Analysis',
    description: 'Monthly sales breakdown for Q1 2024',
    image: mockImages[0],
    type: 'bar',
    data: {
      headers: ['Month', 'Sales', 'Target'],
      rows: [
        ['January', 150000, 140000],
        ['February', 165000, 150000],
        ['March', 180000, 160000],
      ],
    },
    colors: {
      primary: '#4CAF50',
      secondary: '#2196F3',
      background: '#FFFFFF',
      text: '#333333',
    },
    showLegend: true,
    showGrid: true,
    showLabels: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'chart2',
    name: 'Revenue Growth',
    description: 'Year-over-year revenue comparison',
    image: mockImages[1],
    type: 'line',
    data: {
      headers: ['Year', 'Revenue', 'Growth %'],
      rows: [
        ['2022', 1200000, 0],
        ['2023', 1500000, 25],
        ['2024', 1800000, 20],
      ],
    },
    colors: {
      primary: '#FF5722',
      secondary: '#9C27B0',
      background: '#FFFFFF',
      text: '#333333',
    },
    showLegend: true,
    showGrid: true,
    showLabels: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// MockDataService implementation
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDataService {
  static async getCharts(): Promise<Chart[]> {
    await delay(500);
    return mockCharts;
  }

  static async getChartById(id: string): Promise<Chart | undefined> {
    await delay(300);
    return mockCharts.find(chart => chart.id === id);
  }
}

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

const ColorPicker = ({ currentColor, onColorChange, onClose }: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState<string>(currentColor);

  const handleCustomChange = (color: string) => {
    setCustomColor(color);
    onColorChange(color);
  };

  return (
    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 min-w-[280px]">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-3">미리 정의된 색상</label>
        <div className="grid grid-cols-6 gap-2">
          {predefinedColors.map(color => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: currentColor === color ? '#374151' : '#d1d5db',
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">사용자 정의 색상</label>
        <input
          type="color"
          value={customColor}
          onChange={e => handleCustomChange(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
        />
      </div>

      <button
        onClick={onClose}
        className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors">
        닫기
      </button>
    </div>
  );
};

export default function ChartColorCustom() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ChartView>('table');
  const [barDirection, setBarDirection] = useState<BarDirection>('vertical');
  const [tableData, setTableData] = useState<ChartData>({ headers: [], rows: [] });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [colors, setColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState<ShowColorPickerState>({});
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

  // 색상 픽커 토글
  const toggleColorPicker = (colorIndex: number) => {
    setShowColorPicker(prev => ({
      ...prev,
      [colorIndex]: !prev[colorIndex],
    }));
  };

  // Simple chart rendering using D3
  useEffect(() => {
    if (!chartRef.current || !tableData.headers.length || view === 'table') return;

    d3.select(chartRef.current).selectAll('*').remove();

    const { headers, rows } = tableData;
    const data = rows.map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        if (index === 0) {
          obj[header] = row[index];
        } else {
          const value = row[index];
          obj[header] = value && !isNaN(Number(value)) ? Number(value) : 0;
        }
      });
      return obj;
    });

    const width = chartRef.current.clientWidth - 80;
    const height = chartRef.current.clientHeight - 80;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.bottom + margin.top)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (view === 'bar') {
      const x = d3
        .scaleBand()
        .domain(data.map(d => d[headers[0]]))
        .range([0, width])
        .padding(0.1);

      const maxValue = d3.max(data, d => Math.max(...headers.slice(1).map(h => d[h]))) || 0;
      const y = d3
        .scaleLinear()
        .domain([0, maxValue * 1.1])
        .range([height, 0]);

      // X axis
      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

      // Y axis
      svg.append('g').call(d3.axisLeft(y));

      // Grid lines
      if (showGrid) {
        svg
          .append('g')
          .attr('class', 'grid')
          .call(
            d3
              .axisLeft(y)
              .tickSize(-width)
              .tickFormat(() => ''),
          )
          .style('stroke-dasharray', '3,3')
          .style('opacity', 0.3);
      }

      // Bars
      const barWidth = x.bandwidth() / headers.slice(1).length;
      headers.slice(1).forEach((header, index) => {
        svg
          .selectAll(`.bar-${index}`)
          .data(data)
          .enter()
          .append('rect')
          .attr('class', `bar-${index}`)
          .attr('x', d => (x(d[headers[0]]) || 0) + index * barWidth)
          .attr('width', barWidth)
          .attr('y', d => y(d[header]))
          .attr('height', d => height - y(d[header]))
          .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length]);
      });
    } else if (view === 'line' || view === 'area') {
      const x = d3
        .scalePoint()
        .domain(data.map(d => d[headers[0]]))
        .range([0, width]);

      const maxValue = d3.max(data, d => Math.max(...headers.slice(1).map(h => d[h]))) || 0;
      const y = d3
        .scaleLinear()
        .domain([0, maxValue * 1.1])
        .range([height, 0]);

      // X axis
      svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

      // Y axis
      svg.append('g').call(d3.axisLeft(y));

      // Grid lines
      if (showGrid) {
        svg
          .append('g')
          .attr('class', 'grid')
          .call(
            d3
              .axisLeft(y)
              .tickSize(-width)
              .tickFormat(() => ''),
          )
          .style('stroke-dasharray', '3,3')
          .style('opacity', 0.3);
      }

      headers.slice(1).forEach((header, index) => {
        const line = d3
          .line<any>()
          .x(d => x(d[headers[0]]) || 0)
          .y(d => y(d[header]))
          .curve(d3.curveMonotoneX);

        if (view === 'area') {
          const area = d3
            .area<any>()
            .x(d => x(d[headers[0]]) || 0)
            .y0(height)
            .y1(d => y(d[header]))
            .curve(d3.curveMonotoneX);

          svg
            .append('path')
            .datum(data)
            .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length])
            .attr('opacity', 0.6)
            .attr('d', area);
        }

        svg
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', colors[index] || predefinedColors[index % predefinedColors.length])
          .attr('stroke-width', 2)
          .attr('d', line);

        // Points
        svg
          .selectAll(`.dot-${index}`)
          .data(data)
          .enter()
          .append('circle')
          .attr('class', `dot-${index}`)
          .attr('cx', d => x(d[headers[0]]) || 0)
          .attr('cy', d => y(d[header]))
          .attr('r', 4)
          .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length]);
      });
    } else if (view === 'pie') {
      const radius = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;

      const pieData = data.map((d, index) => ({
        name: d[headers[0]],
        value: Number(d[headers[1]]) || 0,
        color: colors[index] || predefinedColors[index % predefinedColors.length],
      }));

      const pie = d3.pie<any>().value(d => d.value);
      const arc = d3
        .arc<any>()
        .innerRadius(0)
        .outerRadius(radius * 0.8);

      const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

      const arcs = g.selectAll('arc').data(pie(pieData)).enter().append('g');

      arcs
        .append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

      const labelArc = d3
        .arc<any>()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.6);

      arcs
        .append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name);
    }
  }, [tableData, view, barDirection, showGrid, colors]);

  const requiredColorCount = getRequiredColorCount();

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
      </div>

      {/* Chart Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">차트 선택:</label>
        <select
          value={selectedChartId}
          onChange={e => handleChartChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          {availableCharts.map(chart => (
            <option key={chart.id} value={chart.id}>
              {chart.name} - {chart.description}
            </option>
          ))}
        </select>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'table' as ChartView, label: '테이블' },
            { key: 'bar' as ChartView, label: '막대 차트' },
            { key: 'line' as ChartView, label: '선 차트' },
            { key: 'area' as ChartView, label: '영역 차트' },
            { key: 'pie' as ChartView, label: '파이 차트' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                view === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 테이블 뷰 */}
      {view === 'table' && (
        <div className="overflow-x-auto mb-4">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            <Plus size={16} />행 추가
          </button>
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                {tableData.headers.map((header, index) => (
                  <th key={index} className="border border-gray-300 p-3 text-left font-semibold">
                    {header}
                  </th>
                ))}
                <th className="border border-gray-300 p-3 text-center font-semibold">삭제</th>
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={e => handleCellEdit(rowIndex, colIndex, e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 막대 차트 방향 토글 */}
      {view === 'bar' && (
        <div className="mb-4 flex items-center gap-4">
          <span className="font-medium">차트 방향:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setBarDirection('vertical')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                barDirection === 'vertical' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
              }`}>
              <RotateCcw size={16} />
              세로
            </button>
            <button
              onClick={() => setBarDirection('horizontal')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors border-l border-gray-300 ${
                barDirection === 'horizontal' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
              }`}>
              <RotateCcw size={16} className="rotate-90" />
              가로
            </button>
          </div>
        </div>
      )}

      {/* 격자 및 색상 설정 */}
      {view !== 'table' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">차트 설정</h3>

          {/* 격자 설정 */}
          <div className="mb-6 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={e => setShowGrid(e.target.checked)}
                className="rounded"
              />
              <span>격자 표시</span>
            </label>
          </div>

          {/* 색상 설정 */}
          <div>
            <h4 className="font-medium mb-3">색상 설정</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: requiredColorCount }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium min-w-[60px]">색상 {index + 1}</span>
                  <div className="relative">
                    <button
                      onClick={() => toggleColorPicker(index)}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: colors[index] || predefinedColors[index % predefinedColors.length] }}
                      />
                      <Palette size={16} />
                    </button>
                    {showColorPicker[index] && (
                      <ColorPicker
                        currentColor={colors[index] || predefinedColors[index % predefinedColors.length]}
                        onColorChange={color => handleColorChange(index, color)}
                        onClose={() => toggleColorPicker(index)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 차트 컨테이너 */}
      {view !== 'table' && (
        <div
          ref={chartRef}
          className="w-full border border-gray-300 rounded-lg p-4 bg-white"
          style={{ height: '500px' }}
        />
      )}
    </div>
  );
}
