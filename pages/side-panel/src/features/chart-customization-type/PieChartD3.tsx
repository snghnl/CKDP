import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
  data: { name: string; value: number }[];
  width: number;
  height: number;
}

const PieChartD3: React.FC<PieChartProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);

    // Use viewBox for responsive scaling
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

    // Calculate radius based on the width, leaving some padding
    const radius = (width / 2) * 0.7; // Use 70% of half the width as radius
    // const radius = Math.min(width, height) / 2; // Previous calculation

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3
      .pie<{ name: string; value: number }>()
      .value(d => d.value)
      .sort(null);

    const path = d3
      .arc<d3.PieArcDatum<{ name: string; value: number }>>()
      .outerRadius(radius - 10) // Adjust outer radius based on the calculated radius
      .innerRadius(0);

    const arc = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', d => color(d.data.name));

    // Optional: Add tooltips or labels here later
  }, [data, width, height]); // Redraw chart if data, width, or height changes

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default PieChartD3;
