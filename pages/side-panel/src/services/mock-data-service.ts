import type { Chart } from '../utils/shared-types';

export class MockDataService {
  static async getCharts(): Promise<Chart[]> {
    // Mock data for bar/line/area charts
    const barChartData = {
      name: 'Sample Bar Chart',
      data: {
        headers: ['Category', 'Value1', 'Value2'],
        rows: [
          ['A', 10, 20],
          ['B', 15, 25],
          ['C', 20, 30],
        ],
      },
      showGrid: true,
      colors: {
        primary: '#1f77b4',
      },
    };

    // Mock data for pie chart
    const pieChartData = {
      name: 'Sample Pie Chart',
      data: {
        headers: ['Category', 'Value'],
        rows: [
          ['Product A', 35],
          ['Product B', 25],
          ['Product C', 20],
          ['Product D', 15],
          ['Product E', 5],
        ],
      },
      showGrid: false,
      colors: {
        primary: '#1f77b4',
      },
    };

    return [barChartData, pieChartData];
  }
}
