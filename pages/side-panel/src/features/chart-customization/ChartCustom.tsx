import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as Plot from '@observablehq/plot';
import html2canvas from 'html2canvas';
import type { Chart } from '@extension/shared';
import {
  Tabs,
  Tab,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import { VerticalAlignCenter, HorizontalRule, AddCircleOutline, DeleteOutline } from '@mui/icons-material';

interface ChartCustomProps {
  chart: Chart;
  onChartUpdate?: (chart: Chart) => void;
}

type ChartView = 'table' | 'bar' | 'line' | 'area' | 'pie';
type BarDirection = 'vertical' | 'horizontal';

export const ChartCustom: React.FC<ChartCustomProps> = ({ chart, onChartUpdate }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ChartView>('table');
  const [lastChartView, setLastChartView] = useState<Exclude<ChartView, 'table'> | null>(null); // Track last non-table view
  const [barDirection, setBarDirection] = useState<BarDirection>(chart?.type === 'bar' ? 'vertical' : 'vertical'); // Default vertical for bar chart
  const [tableData, setTableData] = useState(chart?.data ?? { headers: [], rows: [] });
  const [showGrid, setShowGrid] = useState(chart?.showGrid ?? true); // Grid visibility state
  const [gridInterval, setGridInterval] = useState<number | 'auto'>('auto'); // Grid interval state, default 'auto'
  const [gridIntervalInput, setGridIntervalInput] = useState('auto'); // State for TextField input value

  // Function to add a new row
  const handleAddRow = () => {
    const newRow = tableData.headers.map(() => ''); // Create a new row with empty values
    const newTableData = {
      ...tableData,
      rows: [...tableData.rows, newRow],
    };
    setTableData(newTableData);
    onChartUpdate?.({
      ...chart,
      data: newTableData,
    });
  };

  // Function to delete a row by index
  const handleDeleteRow = (index: number) => {
    const newRows = tableData.rows.filter((_, i) => i !== index);
    const newTableData = {
      ...tableData,
      rows: newRows,
    };
    setTableData(newTableData);
    onChartUpdate?.({
      ...chart,
      data: newTableData,
    });
  };

  // Handle grid visibility change
  const handleShowGridChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowGrid(checked);
    onChartUpdate?.({
      ...chart,
      showGrid: checked,
    });
  };

  // Handle grid interval input change
  const handleGridIntervalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGridIntervalInput(value); // Always update input state

    // Update gridInterval state only if value is valid 'auto' or a number
    if (value.toLowerCase() === 'auto' || value === '') {
      setGridInterval('auto');
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        setGridInterval(num);
      }
      // If it's not 'auto' and not a valid number, gridInterval state is not updated,
      // keeping the last valid value (auto or number).
    }
  };

  // Sync gridIntervalInput with gridInterval state when gridInterval changes externally
  useEffect(() => {
    setGridIntervalInput(gridInterval === 'auto' ? 'auto' : String(gridInterval));
  }, [gridInterval]);

  useEffect(() => {
    if (!chartRef.current || !tableData) return;

    // Update last non-table view
    if (view !== 'table') {
      setLastChartView(view);
    } else if (lastChartView === null && view === 'table') {
      // If we are in table view and no chart view was selected yet, default to bar
      // This handles the initial load state where view is 'table' and lastChartView is null
      setLastChartView('bar'); // Default to bar chart initially in table view
    }

    // 기존 차트 제거 (뷰 변경 시 항상 제거)
    d3.select(chartRef.current).selectAll('*').remove();

    const { headers, rows } = tableData;
    const data = rows.map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    // Determine which chart to draw based on current view or last non-table view
    const chartViewToRender = view === 'table' ? lastChartView : view;

    if (!chartViewToRender) {
      // Don't render chart if no view selected (should not happen with initial default)
      return;
    }

    let marks;
    let plotOptions: Plot.PlotOptions = {
      marks,
      color: {
        legend: chart.showLegend,
      },
      grid: showGrid, // Use showGrid state
      margin: 40,
    };

    // Interval option to apply only to quantitative axes
    const quantitativeIntervalOption = typeof gridInterval === 'number' ? { interval: gridInterval } : {};

    switch (chartViewToRender) {
      case 'bar':
        const currentBarDirection =
          view === 'table' && lastChartView === 'bar' ? barDirection : view === 'bar' ? barDirection : 'vertical';
        if (currentBarDirection === 'vertical') {
          marks = [Plot.barY(data, { x: headers[0], y: headers[1], fill: chart.colors.primary })];
          plotOptions = {
            ...plotOptions,
            marks,
            x: { label: headers[0] }, // x-axis is categorical for vertical bar chart, no interval here
            y: { label: headers[1] + ' →', ...quantitativeIntervalOption }, // y-axis is quantitative, apply interval
          };
        } else {
          // horizontal bar chart
          marks = [Plot.barX(data, { y: headers[0], x: headers[1], fill: chart.colors.primary })];
          plotOptions = {
            ...plotOptions,
            marks,
            x: { label: headers[1] + ' →', ...quantitativeIntervalOption }, // x-axis is quantitative, apply interval
            y: {
              label: headers[0],
              domain: data.map(d => d[headers[0]]),
              labelOffset: 10,
              tickFormat: (d: any) => d,
              tickSize: 0,
              align: 0.5,
              // y-axis is categorical for horizontal bar chart, no interval here
            },
            marginRight: 40,
            marginLeft: Math.max(...data.map(d => String(d[headers[0]]).length)) * 10 + 60,
          };
        }
        break;
      case 'line':
        marks = [Plot.lineY(data, { x: headers[0], y: headers[1], stroke: chart.colors.primary })];
        plotOptions = {
          ...plotOptions,
          marks,
          x: { label: headers[0], ...quantitativeIntervalOption }, // Assuming x-axis is quantitative/temporal, apply interval
          y: { label: headers[1] + ' →', ...quantitativeIntervalOption }, // Assuming y-axis is quantitative, apply interval
        };
        break;
      case 'area':
        marks = [Plot.areaY(data, { x: headers[0], y: headers[1], fill: chart.colors.primary })];
        plotOptions = {
          ...plotOptions,
          marks,
          x: { label: headers[0], ...quantitativeIntervalOption }, // Assuming x-axis is quantitative/temporal, apply interval
          y: { label: headers[1] + ' →', ...quantitativeIntervalOption }, // Assuming y-axis is quantitative, apply interval
        };
        break;
      case 'pie':
        // D3.js 파이 차트 렌더링 (Plot.js와 별개)
        const width = chartRef.current.clientWidth;
        const height = chartRef.current.clientHeight;
        const radius = (Math.min(width, height) / 2) * 0.8;

        const svg = d3
          .select(chartRef.current)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        const pieData = data.map(d => ({
          name: d[headers[0]],
          value: Number(d[headers[1]]),
        }));

        const pie = d3.pie<(typeof pieData)[0]>().value(d => d.value);

        const arc = d3.arc<d3.PieArcDatum<(typeof pieData)[0]>>().innerRadius(0).outerRadius(radius);

        const arcs = svg.selectAll('arc').data(pie(pieData)).enter().append('g');

        arcs
          .append('path')
          .attr('d', arc)
          .attr('fill', chart.colors.primary)
          .attr('stroke', 'white')
          .style('stroke-width', '2px');

        const labelArc = d3
          .arc<d3.PieArcDatum<(typeof pieData)[0]>>()
          .innerRadius(radius * 0.6)
          .outerRadius(radius * 0.6);

        arcs
          .append('text')
          .attr('transform', d => `translate(${labelArc.centroid(d)})`)
          .attr('text-anchor', 'middle')
          .text(d => d.data.name);

        return; // 파이 차트는 D3로 직접 처리하므로 Plot.js 렌더링 건너뛰기
    }

    // Plot.js 차트 렌더링
    const chartPlot = Plot.plot(plotOptions);
    chartRef.current.appendChild(chartPlot);

    return () => {
      // Cleanup function to remove the chart when dependencies change or component unmounts
      d3.select(chartRef.current).selectAll('*').remove();
    };
  }, [chart, tableData, view, barDirection, lastChartView, showGrid, gridInterval]); // dependencies

  const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;

    const newTableData = {
      ...tableData,
      rows: newRows,
    };

    setTableData(newTableData);
    onChartUpdate?.({
      ...chart,
      data: newTableData,
    });
  };

  const handleDownload = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `${chart.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading chart:', error);
    }
  };

  // Calculate dynamic height for horizontal bar chart (still needed for container height)
  const dynamicHeight =
    (view === 'bar' && barDirection === 'horizontal') ||
    (view === 'table' && lastChartView === 'bar' && barDirection === 'horizontal')
      ? Math.max(tableData.rows.length * 30 + 100, 400)
      : 400; // Default height

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{chart.name}</h2>
        <button onClick={handleDownload} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Download
        </button>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={view} onChange={(_, newValue) => setView(newValue)} variant="scrollable" scrollButtons="auto">
          <Tab label="테이블" value="table" />
          <Tab label="막대 차트" value="bar" />
          <Tab label="선 차트" value="line" />
          <Tab label="영역 차트" value="area" />
          <Tab label="파이 차트" value="pie" />
        </Tabs>
      </Box>

      {/* Table content - only shown in table view, placed above chart container */}
      {view === 'table' && (
        <div className="overflow-x-auto mb-4">
          {' '}
          {/* Added mb-4 for spacing */}
          <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={handleAddRow} sx={{ mb: 2 }}>
            행 추가
          </Button>
          <table className="min-w-full border">
            <thead>
              <tr>
                {tableData.headers.map((header, index) => (
                  <th key={index} className="border p-2 bg-gray-100">
                    {header}
                  </th>
                ))}
                <th className="border p-2 bg-gray-100"></th> {/* Empty header for delete button column */}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border p-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={e => handleCellEdit(rowIndex, colIndex, e.target.value)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                  ))}
                  <td className="border p-2 text-center">
                    <DeleteOutline color="error" sx={{ cursor: 'pointer' }} onClick={() => handleDeleteRow(rowIndex)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bar direction toggle only shown in bar view or when last view was bar in table view */}
      {(view === 'bar' || (view === 'table' && lastChartView === 'bar')) && (
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={barDirection}
            exclusive
            onChange={(_, newDirection) => newDirection && setBarDirection(newDirection)}
            aria-label="차트 방향">
            <ToggleButton value="vertical" aria-label="세로 막대">
              <VerticalAlignCenter />
            </ToggleButton>
            <ToggleButton value="horizontal" aria-label="가로 막대">
              <HorizontalRule />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Grid control options (show/interval) - shown for chart views or table view when a chart was previously selected */}
      {(view !== 'table' || (view === 'table' && lastChartView !== null)) && (
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel control={<Switch checked={showGrid} onChange={handleShowGridChange} />} label="격자 표시" />
          <TextField
            label="격자 간격 (auto)"
            value={gridIntervalInput}
            onChange={handleGridIntervalInputChange}
            size="small"
            sx={{ width: 120 }}
          />
        </Box>
      )}

      {/* Chart container - always rendered, placed below table content. 
          Chart inside is rendered based on current view or lastChartView. */}
      <div ref={chartRef} className="w-full border rounded-lg p-4" style={{ height: `${dynamicHeight}px` }} />
    </div>
  );
};
