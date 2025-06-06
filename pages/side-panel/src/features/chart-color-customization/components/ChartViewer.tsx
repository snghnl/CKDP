//ChartViewer.tsx

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { ChartData, ChartView, BarDirection } from '@extension/shared';

// 부드러운 무지개 색상
const predefinedColors = [
  '#FF6B6B', // 산호색
  '#4ECDC4', // 민트
  '#45B7D1', // 하늘색
  '#96CEB4', // 세이지
  '#FFEEAD', // 크림
  '#D4A5A5', // 로즈
  '#9B59B6', // 라벤더
  '#3498DB', // 블루
  '#E67E22', // 오렌지
  '#2ECC71', // 그린
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

  const drawChart = useCallback(() => {
    // 디버깅을 위해 데이터 및 view 상태 로그 추가
    console.log('drawChart called', { tableData, view, barDirection, showGrid, colors, gridInterval });
    console.log('chartRef.current:', chartRef.current);

    if (!chartRef.current || !tableData?.headers?.length || view === 'table') {
      console.log('drawChart condition not met, returning.');
      if (!chartRef.current) console.log('Reason: chartRef.current is null');
      if (!tableData?.headers?.length) console.log('Reason: tableData or headers empty');
      if (view === 'table') console.log('Reason: view is table');
      return;
    }

    d3.select(chartRef.current).selectAll('*').remove();

    const { headers, rows } = tableData;
    const data = rows.map(row => {
      const obj: Record<string, any> = {};
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

    if (!data.length) return;

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
      let x: any, y: any;
      const maxValue = d3.max(data, d => Math.max(...headers.slice(1).map(h => d[h]))) || 0;

      if (barDirection === 'horizontal') {
        // 가로 막대 그래프 스케일 설정
        x = d3
          .scaleLinear()
          .domain([0, maxValue * 1.1])
          .range([0, width]);

        y = d3
          .scaleBand()
          .domain(data.map(d => d[headers[0]]))
          .range([0, height])
          .padding(0.2);
      } else {
        // 세로 막대 그래프 (기존)
        x = d3
          .scaleBand()
          .domain(data.map(d => d[headers[0]]))
          .range([0, width])
          .padding(0.1);

        y = d3
          .scaleLinear()
          .domain([0, maxValue * 1.1])
          .range([height, 0]);
      }

      // 축 그리기 (그리드 간격에 맞춰 틱 조정)
      if (barDirection === 'horizontal') {
        // X축 (수치축)
        if (gridInterval !== 'auto' && typeof gridInterval === 'number') {
          const ticks = d3.range(0, maxValue * 1.1, gridInterval);
          svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x).tickValues(ticks));
        } else {
          svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
        }

        // Y축 (카테고리축)
        svg.append('g').call(d3.axisLeft(y));
      } else {
        // X축 (카테고리축)
        svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

        // Y축 (수치축)
        if (gridInterval !== 'auto' && typeof gridInterval === 'number') {
          const ticks = d3.range(0, maxValue * 1.1, gridInterval);
          svg.append('g').call(d3.axisLeft(y).tickValues(ticks));
        } else {
          svg.append('g').call(d3.axisLeft(y));
        }
      }

      // 그리드 라인 (개선된 간격 조정 포함)
      if (showGrid) {
        if (barDirection === 'horizontal') {
          const gridLines = svg.append('g').attr('class', 'grid');

          if (gridInterval !== 'auto' && typeof gridInterval === 'number') {
            const ticks = d3.range(0, maxValue * 1.1, gridInterval);
            gridLines.call(
              d3
                .axisBottom(x)
                .tickValues(ticks)
                .tickSize(height)
                .tickFormat(() => ''),
            );
          } else {
            gridLines.call(
              d3
                .axisBottom(x)
                .tickSize(height)
                .tickFormat(() => ''),
            );
          }

          gridLines.style('stroke-dasharray', '3,3').style('opacity', 0.3);
        } else {
          const gridLines = svg.append('g').attr('class', 'grid');

          if (gridInterval !== 'auto' && typeof gridInterval === 'number') {
            const ticks = d3.range(0, maxValue * 1.1, gridInterval);
            gridLines.call(
              d3
                .axisLeft(y)
                .tickValues(ticks)
                .tickSize(-width)
                .tickFormat(() => ''),
            );
          } else {
            gridLines.call(
              d3
                .axisLeft(y)
                .tickSize(-width)
                .tickFormat(() => ''),
            );
          }

          gridLines.style('stroke-dasharray', '3,3').style('opacity', 0.3);
        }
      }

      // 막대 그리기
      if (barDirection === 'horizontal') {
        const barWidth = y.bandwidth() / headers.slice(1).length;
        headers.slice(1).forEach((header, index) => {
          const barGroup = svg
            .selectAll(`.bar-group-${index}`)
            .data(data)
            .enter()
            .append('g')
            .attr('class', `bar-group-${index}`)
            .attr('transform', d => `translate(0, ${(y(d[headers[0]]) || 0) + index * barWidth})`);

          barGroup
            .append('rect')
            .attr('width', d => x(d[header]))
            .attr('height', barWidth)
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length])
            .attr('rx', 4)
            .attr('ry', 4)
            .style('transition', 'all 0.3s ease')
            .on('mouseover', function (event, d) {
              d3.select(this).transition().duration(200).attr('opacity', 0.8).attr('filter', 'brightness(1.1)');

              const tooltip = d3
                .select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '8px 12px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('z-index', '1000')
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
                .style('backdrop-filter', 'blur(4px)');

              tooltip
                .html(`${d[headers[0]]}<br/>${header}: ${d[header]}`)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', function () {
              d3.select(this).transition().duration(200).attr('opacity', 1).attr('filter', 'none');
              d3.selectAll('.tooltip').remove();
            })
            .on('click', () => onSeriesSelect?.(index));
        });
      } else {
        // 세로 막대 (기졸 코드)
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
            .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length])
            .attr('rx', 4)
            .attr('ry', 4)
            .style('transition', 'all 0.3s ease')
            .on('mouseover', function (event, d) {
              d3.select(this).transition().duration(200).attr('opacity', 0.8).attr('filter', 'brightness(1.1)');

              const tooltip = d3
                .select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '8px 12px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('z-index', '1000')
                .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
                .style('backdrop-filter', 'blur(4px)');

              tooltip
                .html(`${d[headers[0]]}<br/>${header}: ${d[header]}`)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 10}px`);
            })
            .on('mouseout', function () {
              d3.select(this).transition().duration(200).attr('opacity', 1).attr('filter', 'none');
              d3.selectAll('.tooltip').remove();
            })
            .on('click', () => onSeriesSelect?.(index));
        });
      }
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

      // Y axis (그리드 간격에 맞춰 틱 조정)
      if (gridInterval !== 'auto' && typeof gridInterval === 'number') {
        const ticks = d3.range(0, maxValue * 1.1, gridInterval);
        svg.append('g').call(d3.axisLeft(y).tickValues(ticks));
      } else {
        svg.append('g').call(d3.axisLeft(y));
      }

      // 그리드 라인 (개선된 간격 조정 포함)
      if (showGrid) {
        const gridLines = svg.append('g').attr('class', 'grid');

        if (gridInterval !== 'auto' && typeof gridInterval === 'number') {
          const ticks = d3.range(0, maxValue * 1.1, gridInterval);
          gridLines.call(
            d3
              .axisLeft(y)
              .tickValues(ticks)
              .tickSize(-width)
              .tickFormat(() => ''),
          );
        } else {
          gridLines.call(
            d3
              .axisLeft(y)
              .tickSize(-width)
              .tickFormat(() => ''),
          );
        }

        gridLines.style('stroke-dasharray', '3,3').style('opacity', 0.3);
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
          .attr('fill', colors[index] || predefinedColors[index % predefinedColors.length])
          .on('click', () => onSeriesSelect?.(index));
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
        .style('stroke-width', '2px')
        .on('click', (event, d) => onSeriesSelect?.(d.index));

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
  }, [tableData, view, barDirection, showGrid, colors, gridInterval, onSeriesSelect]);

  useEffect(() => {
    console.log('useEffect triggered');
    drawChart();

    const resizeObserver = new ResizeObserver(() => {
      console.log('ResizeObserver triggered');
      drawChart();
    });

    if (chartRef.current) {
      console.log('Observing chartRef.current');
      resizeObserver.observe(chartRef.current);

      // chartRef.current가 설정되었을 때 콜백 호출
      if (onChartContainerReady) {
        onChartContainerReady(chartRef.current);
      }
    }

    return () => {
      console.log('useEffect cleanup: disconnecting ResizeObserver');
      resizeObserver.disconnect();
    };
  }, [drawChart, chartRef, onChartContainerReady, onSeriesSelect]);

  if (view === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th key={index} className="border border-gray-300 px-3 py-2 bg-gray-100 text-sm font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 px-3 py-2 text-sm">
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

  return (
    <div className="relative w-full h-96" style={{ minHeight: '400px' }}>
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};
