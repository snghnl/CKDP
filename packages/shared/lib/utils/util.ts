import { Image, Chart, ChartData, SavedImage, Citation, ResponseData } from './shared-types.js';

export const defaultImage: Image = {
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
};

export const defaultChart: Chart = {
  id: 'chart1',
  name: 'Q1 Sales Analysis',
  description: 'Monthly sales breakdown for Q1 2024',
  image: defaultImage,
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
};

export const makeNewChart = (savedImage: SavedImage, data: ResponseData) => {
  const headers = data.headers;
  const rows = data.rows.map(row => row.cells);

  // Convert SavedImage to Image format
  const image: Image = {
    id: savedImage.id,
    url: savedImage.src,
    description: savedImage.alt,
    width: savedImage.width,
    height: savedImage.height,
    pageUrl: savedImage.directory,
    captureTimestamp: new Date(savedImage.savedAt).getTime(),
    boundingRect: {
      top: 0,
      left: 0,
      width: savedImage.width,
      height: savedImage.height,
    },
  };

  const chart: Chart = {
    id: crypto.randomUUID(),
    name: savedImage.alt || 'New Chart',
    description: `Chart created from ${savedImage.alt}`,
    image: image,
    type: 'table',
    data: {
      headers: headers,
      rows: rows,
    },
    colors: {
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#ffffff',
      text: '#000000',
    },
    showLegend: true,
    showGrid: true,
    showLabels: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return chart;
};

export const makeNewCitation = (data: ResponseData) => {
  const citations = data.citations;

  const citation = defaultCitation.map(c => {
    return {
      format: c.format,
      text: citations[c.format],
    };
  });

  return citation;
};

export const defaultCitation: Citation[] = [
  {
    format: 'APA',
    text: 'APA citation',
  },
  {
    format: 'MLA',
    text: 'MLA citation',
  },
  {
    format: 'Chicago',
    text: 'Chicago citation',
  },
  {
    format: 'Harvard',
    text: 'Harvard citation',
  },
  {
    format: 'IEEE',
    text: 'IEEE citation',
  },
  {
    format: 'Vancouver',
    text: 'Vancouver citation',
  },
  {
    format: 'Turabian',
    text: 'Turabian citation',
  },
];
