//mockDataService.ts
import { Chart, Image } from '@extension/shared';

// Mock data
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

export class MockDataService {
  static async getCharts(): Promise<Chart[]> {
    await delay(500);
    return mockCharts;
  }

  static async getChartById(id: string): Promise<Chart | undefined> {
    await delay(300);
    return mockCharts.find(chart => chart.id === id);
  }
}
