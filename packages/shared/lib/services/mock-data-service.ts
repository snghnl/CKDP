import type { Image, Chart, Source, Citation, ChartType, CitationFormat } from '../utils/shared-types.js';

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

export const mockCharts: Chart[] = [
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
      headers: ['Year', 'Revenue', 'Growth'],
      rows: [
        ['2022', 1200000, '0%'],
        ['2023', 1500000, '25%'],
        ['2024', 1800000, '20%'],
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

const mockSources: Source[] = [
  {
    id: 'src1',
    name: 'Q1 2024 Sales Report',
    description: 'Official sales report for Q1 2024',
    citations: [
      {
        format: 'APA',
        content: 'Sales Department. (2024). Q1 2024 Sales Report. Company Internal Document.',
        url: 'https://example.com/sales-report',
        accessedDate: '2024-03-15',
        authors: ['Sales Department'],
        title: 'Q1 2024 Sales Report',
        publicationDate: '2024-03-15',
        publisher: 'Company Internal',
        location: 'Internal Document',
      },
    ],
    url: 'https://example.com/sales-report',
    type: 'document',
    lastAccessed: Date.now(),
  },
  {
    id: 'src2',
    name: 'Annual Revenue Analysis',
    description: 'Year-over-year revenue analysis report',
    citations: [
      {
        format: 'MLA',
        content: 'Financial Analysis Team. "Annual Revenue Analysis 2024." Company Reports, 15 Mar. 2024.',
        url: 'https://example.com/revenue-analysis',
        accessedDate: '2024-03-15',
        authors: ['Financial Analysis Team'],
        title: 'Annual Revenue Analysis 2024',
        publicationDate: '2024-03-15',
        publisher: 'Company Reports',
      },
    ],
    url: 'https://example.com/revenue-analysis',
    type: 'document',
    lastAccessed: Date.now(),
  },
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockDataService {
  // Fetch all images
  static async getImages(): Promise<Image[]> {
    await delay(500); // Simulate network delay
    return mockImages;
  }

  // Fetch image by ID
  static async getImageById(id: string): Promise<Image | undefined> {
    await delay(300);
    return mockImages.find(img => img.id === id);
  }

  // Fetch all charts
  static async getCharts(): Promise<Chart[]> {
    await delay(500);
    return mockCharts;
  }

  // Fetch chart by ID
  static async getChartById(id: string): Promise<Chart | undefined> {
    await delay(300);
    return mockCharts.find(chart => chart.id === id);
  }

  // Fetch charts by type
  static async getChartsByType(type: ChartType): Promise<Chart[]> {
    await delay(400);
    return mockCharts.filter(chart => chart.type === type);
  }

  // Fetch all sources
  static async getSources(): Promise<Source[]> {
    await delay(500);
    return mockSources;
  }

  // Fetch source by ID
  static async getSourceById(id: string): Promise<Source | undefined> {
    await delay(300);
    return mockSources.find(source => source.id === id);
  }

  // Fetch sources by citation format
  static async getSourcesByCitationFormat(format: CitationFormat): Promise<Source[]> {
    await delay(400);
    return mockSources.filter(source => source.citations.some((citation: Citation) => citation.format === format));
  }

  // Search across all data types
  static async search(query: string): Promise<{
    images: Image[];
    charts: Chart[];
    sources: Source[];
  }> {
    await delay(600);
    const lowerQuery = query.toLowerCase();

    return {
      images: mockImages.filter(
        img => img.description?.toLowerCase().includes(lowerQuery) || img.url.toLowerCase().includes(lowerQuery),
      ),
      charts: mockCharts.filter(
        chart => chart.name.toLowerCase().includes(lowerQuery) || chart.description.toLowerCase().includes(lowerQuery),
      ),
      sources: mockSources.filter(
        source =>
          source.name.toLowerCase().includes(lowerQuery) || source.description.toLowerCase().includes(lowerQuery),
      ),
    };
  }
}
