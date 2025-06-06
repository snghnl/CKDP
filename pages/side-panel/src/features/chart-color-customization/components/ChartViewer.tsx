//ChartViewer.tsx
import { useEffect, useRef, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { ChartData, ChartView, BarDirection } from '@extension/shared';

// 부드러운 무지개 색상
const predefinedColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B59B6',
  '#3498DB',
  '#E67E22',
  '#2ECC71',
];

interface ChartViewerProps {
  tableData: ChartData;
  view: ChartView;
  barDirection: BarDirection;
  showGrid: boolean;
  colors: string[];
  gridInterval: number | 'auto';
  onBarDirectionChange?: (direction: BarDirection) => void;
  onChartContainerReady?: (element: HTMLDivElement | null) => void;
  onSeriesSelect?: (index: number) => void;
}

interface DataPoint {
  [key: string]: string | number;
}

interface ChartError {
  message: string;
  type: 'data' | 'render' | 'resize';
}

export const ChartViewer = ({
  tableData,
  view,
  barDirection,
  showGrid,
  colors,
  gridInterval,
  onBarDirectionChange,
  onChartContainerReady,
  onSeriesSelect,
}: ChartViewerProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const errorRef = useRef<ChartError | null>(null);

  // 1. 타입 안전성 개선 - 데이터 변환 메모화
  const processedData = useMemo((): DataPoint[] => {
    if (!tableData?.headers?.length || !tableData?.rows?.length) {
      return [];
    }

    try {
      const { headers, rows } = tableData;
      return rows.map(row => {
        const obj: DataPoint = {};
        headers.forEach((header, index) => {
          if (index === 0) {
            obj[header] = row[index] || '';
          } else {
            const value = row[index];
            obj[header] = value && !isNaN(Number(value)) ? Number(value) : 0;
          }
        });
        return obj;
      });
    } catch (error) {
      console.error('Data processing error:', error);
      errorRef.current = { message: 'Failed to process chart data', type: 'data' };
      return [];
    }
  }, [tableData]);

  // 2. 툴팁 유틸리티 함수 분리
  const createTooltip = useCallback(
    (event: MouseEvent, d: DataPoint, header: string) => {
      try {
        // 기존 툴팁 제거
        d3.selectAll('.chart-tooltip').remove();

        const tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'chart-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.9)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '6px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('box-shadow', '0 4px 8px rgba(0,0,0,0.3)')
          .style('backdrop-filter', 'blur(4px)');

        const category = tableData?.headers?.[0] || 'Category';
        tooltip
          .html(`<strong>${d[category]}</strong><br/>${header}: ${d[header]}`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      } catch (error) {
        console.error('Tooltip creation error:', error);
      }
    },
    [tableData?.headers],
  );

  const removeTooltip = useCallback(() => {
    d3.selectAll('.chart-tooltip').remove();
  }, []);

  // 3. 축 생성 유틸리티 함수
  const createAxes = useCallback(
    (
      svg: d3.Selection<SVGGElement, unknown, null, undefined>,
      xScale: any,
      yScale: any,
      width: number,
      height: number,
      maxValue: number,
      isHorizontal: boolean = false,
    ) => {
      try {
        if (isHorizontal) {
          // X축 (수치축)
          const xAxis =
            gridInterval !== 'auto' && typeof gridInterval === 'number'
              ? d3.axisBottom(xScale).tickValues(d3.range(0, maxValue * 1.1, gridInterval))
              : d3.axisBottom(xScale);

          svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);

          // Y축 (카테고리축)
          svg.append('g').call(d3.axisLeft(yScale));
        } else {
          // X축 (카테고리축)
          svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));

          // Y축 (수치축)
          const yAxis =
            gridInterval !== 'auto' && typeof gridInterval === 'number'
              ? d3.axisLeft(yScale).tickValues(d3.range(0, maxValue * 1.1, gridInterval))
              : d3.axisLeft(yScale);

          svg.append('g').call(yAxis);
        }
      } catch (error) {
        console.error('Axes creation error:', error);
      }
    },
    [gridInterval],
  );

  // 4. 그리드 생성 유틸리티 함수
  const createGrid = useCallback(
    (
      svg: d3.Selection<SVGGElement, unknown, null, undefined>,
      xScale: any,
      yScale: any,
      width: number,
      height: number,
      maxValue: number,
      isHorizontal: boolean = false,
    ) => {
      if (!showGrid) return;

      try {
        const gridLines = svg.append('g').attr('class', 'grid');

        if (isHorizontal) {
          const gridAxis =
            gridInterval !== 'auto' && typeof gridInterval === 'number'
              ? d3.axisBottom(xScale).tickValues(d3.range(0, maxValue * 1.1, gridInterval))
              : d3.axisBottom(xScale);

          gridLines.call(gridAxis.tickSize(height).tickFormat(() => ''));
        } else {
          const gridAxis =
            gridInterval !== 'auto' && typeof gridInterval === 'number'
              ? d3.axisLeft(yScale).tickValues(d3.range(0, maxValue * 1.1, gridInterval))
              : d3.axisLeft(yScale);

          gridLines.call(gridAxis.tickSize(-width).tickFormat(() => ''));
        }

        gridLines.style('stroke-dasharray', '3,3').style('opacity', 0.3).style('stroke', '#ccc');
      } catch (error) {
        console.error('Grid creation error:', error);
      }
    },
    [showGrid, gridInterval],
  );

  // 5. 개별 차트 그리기 함수들
  const drawBarChart = useCallback(
    (svg: d3.Selection<SVGGElement, unknown, null, undefined>, data: DataPoint[], width: number, height: number) => {
      try {
        const headers = tableData?.headers || [];
        const maxValue = d3.max(data, d => Math.max(...headers.slice(1).map(h => Number(d[h]) || 0))) || 0;

        let xScale: any, yScale: any;

        if (barDirection === 'horizontal') {
          xScale = d3
            .scaleLinear()
            .domain([0, maxValue * 1.1])
            .range([0, width]);
          yScale = d3
            .scaleBand()
            .domain(data.map(d => String(d[headers[0]])))
            .range([0, height])
            .padding(0.2);
        } else {
          xScale = d3
            .scaleBand()
            .domain(data.map(d => String(d[headers[0]])))
            .range([0, width])
            .padding(0.1);
          yScale = d3
            .scaleLinear()
            .domain([0, maxValue * 1.1])
            .range([height, 0]);
        }

        createAxes(svg, xScale, yScale, width, height, maxValue, barDirection === 'horizontal');
        createGrid(svg, xScale, yScale, width, height, maxValue, barDirection === 'horizontal');

        // 막대 그리기
        const barWidth =
          barDirection === 'horizontal'
            ? yScale.bandwidth() / headers.slice(1).length
            : xScale.bandwidth() / headers.slice(1).length;

        headers.slice(1).forEach((header, index) => {
          const bars = svg
            .selectAll(`.bar-${index}`)
            .data(data)
            .enter()
            .append('rect')
            .attr('class', `bar-${index}`)
            .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length])
            .attr('rx', 4)
            .attr('ry', 4)
            .style('transition', 'all 0.3s ease');

          if (barDirection === 'horizontal') {
            bars
              .attr('x', 0)
              .attr('y', d => (yScale(String(d[headers[0]])) || 0) + index * barWidth)
              .attr('width', d => xScale(Number(d[header]) || 0))
              .attr('height', barWidth);
          } else {
            bars
              .attr('x', d => (xScale(String(d[headers[0]])) || 0) + index * barWidth)
              .attr('y', d => yScale(Number(d[header]) || 0))
              .attr('width', barWidth)
              .attr('height', d => height - yScale(Number(d[header]) || 0));
          }

          // 이벤트 핸들러
          bars
            .on('mouseover', function (event, d) {
              d3.select(this).transition().duration(200).attr('opacity', 0.8);
              createTooltip(event, d, header);
            })
            .on('mouseout', function () {
              d3.select(this).transition().duration(200).attr('opacity', 1);
              removeTooltip();
            })
            .on('click', () => onSeriesSelect?.(index));
        });
      } catch (error) {
        console.error('Bar chart rendering error:', error);
        errorRef.current = { message: 'Failed to render bar chart', type: 'render' };
      }
    },
    [tableData?.headers, barDirection, colors, createAxes, createGrid, createTooltip, removeTooltip, onSeriesSelect],
  );

  const drawLineChart = useCallback(
    (
      svg: d3.Selection<SVGGElement, unknown, null, undefined>,
      data: DataPoint[],
      width: number,
      height: number,
      isArea: boolean = false,
    ) => {
      try {
        const headers = tableData?.headers || [];
        const maxValue = d3.max(data, d => Math.max(...headers.slice(1).map(h => Number(d[h]) || 0))) || 0;

        const xScale = d3
          .scalePoint()
          .domain(data.map(d => String(d[headers[0]])))
          .range([0, width]);
        const yScale = d3
          .scaleLinear()
          .domain([0, maxValue * 1.1])
          .range([height, 0]);

        createAxes(svg, xScale, yScale, width, height, maxValue);
        createGrid(svg, xScale, yScale, width, height, maxValue);

        headers.slice(1).forEach((header, index) => {
          const line = d3
            .line<DataPoint>()
            .x(d => xScale(String(d[headers[0]])) || 0)
            .y(d => yScale(Number(d[header]) || 0))
            .curve(d3.curveMonotoneX);

          if (isArea) {
            const area = d3
              .area<DataPoint>()
              .x(d => xScale(String(d[headers[0]])) || 0)
              .y0(height)
              .y1(d => yScale(Number(d[header]) || 0))
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

          // 포인트
          svg
            .selectAll(`.dot-${index}`)
            .data(data)
            .enter()
            .append('circle')
            .attr('class', `dot-${index}`)
            .attr('cx', d => xScale(String(d[headers[0]])) || 0)
            .attr('cy', d => yScale(Number(d[header]) || 0))
            .attr('r', 4)
            .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length])
            .on('mouseover', (event, d) => createTooltip(event, d, header))
            .on('mouseout', removeTooltip)
            .on('click', () => onSeriesSelect?.(index));
        });
      } catch (error) {
        console.error('Line chart rendering error:', error);
        errorRef.current = { message: 'Failed to render line chart', type: 'render' };
      }
    },
    [tableData?.headers, colors, createAxes, createGrid, createTooltip, removeTooltip, onSeriesSelect],
  );

  const drawPieChart = useCallback(
    (svg: d3.Selection<SVGGElement, unknown, null, undefined>, data: DataPoint[], width: number, height: number) => {
      try {
        const headers = tableData?.headers || [];
        const radius = Math.min(width, height) / 2;
        const centerX = width / 2;
        const centerY = height / 2;

        const pieData = data.map((d, index) => ({
          name: String(d[headers[0]]),
          value: Number(d[headers[1]]) || 0,
          color: colors[index] || predefinedColors[index % predefinedColors.length],
          index,
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
          .style('stroke-width', '2px')
          .on('mouseover', (event, d) =>
            createTooltip(event, { [headers[0]]: d.data.name, [headers[1]]: d.data.value }, headers[1]),
          )
          .on('mouseout', removeTooltip)
          .on('click', (event, d) => onSeriesSelect?.(d.data.index));

        const labelArc = d3
          .arc<any>()
          .innerRadius(radius * 0.6)
          .outerRadius(radius * 0.6);
        arcs
          .append('text')
          .attr('transform', d => `translate(${labelArc.centroid(d)})`)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', 'black')
          .text(d => d.data.name);
      } catch (error) {
        console.error('Pie chart rendering error:', error);
        errorRef.current = { message: 'Failed to render pie chart', type: 'render' };
      }
    },
    [tableData?.headers, colors, createTooltip, removeTooltip, onSeriesSelect],
  );

  // 1. 성능 최적화 - 콜백 최적화
  const drawChart = useCallback(() => {
    if (!chartRef.current || !processedData.length || view === 'table') {
      return;
    }

    try {
      // 기존 차트 제거
      d3.select(chartRef.current).selectAll('*').remove();

      // 기존 툴팁 제거
      removeTooltip();

      const containerWidth = chartRef.current.clientWidth;
      const containerHeight = chartRef.current.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) {
        return;
      }

      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      if (width <= 0 || height <= 0) {
        return;
      }

      const svg = d3
        .select(chartRef.current)
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .attr('role', 'img')
        .attr('aria-label', `${view} chart showing ${tableData?.headers?.slice(1).join(', ') || 'data'}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // 6. 컴포넌트 분할 - 차트 타입별 렌더링
      switch (view) {
        case 'bar':
          drawBarChart(svg, processedData, width, height);
          break;
        case 'line':
          drawLineChart(svg, processedData, width, height, false);
          break;
        case 'area':
          drawLineChart(svg, processedData, width, height, true);
          break;
        case 'pie':
          drawPieChart(svg, processedData, width, height);
          break;
        default:
          console.warn(`Unknown chart type: ${view}`);
      }

      errorRef.current = null; // 성공시 에러 초기화
    } catch (error) {
      console.error('Chart rendering error:', error);
      errorRef.current = { message: 'Failed to render chart', type: 'render' };
    }
  }, [
    processedData,
    view,
    barDirection,
    showGrid,
    gridInterval,
    drawBarChart,
    drawLineChart,
    drawPieChart,
    removeTooltip,
    tableData?.headers,
  ]);

  // 4. 에러 처리 개선된 useEffect
  useEffect(() => {
    try {
      drawChart();

      // ResizeObserver 설정
      if (chartRef.current && !resizeObserverRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          try {
            drawChart();
          } catch (error) {
            console.error('Resize chart error:', error);
            errorRef.current = { message: 'Failed to resize chart', type: 'resize' };
          }
        });

        resizeObserverRef.current.observe(chartRef.current);
        onChartContainerReady?.(chartRef.current);
      }
    } catch (error) {
      console.error('Chart initialization error:', error);
      errorRef.current = { message: 'Failed to initialize chart', type: 'render' };
    }

    return () => {
      // 2. 메모리 누수 방지
      removeTooltip();
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [drawChart, onChartContainerReady, removeTooltip]);

  // 테이블 뷰 렌더링
  if (view === 'table') {
    return (
      <div className="overflow-x-auto" role="table" aria-label="Data table">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-3 py-2 bg-gray-100 text-sm font-medium"
                  scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 px-3 py-2 text-sm"
                    role={colIndex === 0 ? 'rowheader' : 'cell'}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 에러 상태 표시
  if (errorRef.current) {
    return (
      <div
        className="flex items-center justify-center w-full h-96 bg-red-50 border border-red-200 rounded-lg"
        role="alert"
        aria-live="polite">
        <div className="text-center">
          <div className="text-red-600 font-medium mb-2">Chart Error</div>
          <div className="text-red-500 text-sm">{errorRef.current.message}</div>
        </div>
      </div>
    );
  }

  // 차트 컨테이너
  return (
    <div className="relative w-full h-96" style={{ minHeight: '400px' }}>
      <div ref={chartRef} className="w-full h-full" role="img" aria-label={`${view} chart`} tabIndex={0} />
    </div>
  );
};
