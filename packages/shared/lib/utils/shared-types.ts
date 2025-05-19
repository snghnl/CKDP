// 구체적인 타입 명세는 shared/README.md 확인

export type ValueOf<T> = T[keyof T];

export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE' | 'Turabian' | 'Vancouver';

export type ChartType = 'pie' | 'bar' | 'line' | 'scatter' | 'area' | 'radar' | 'doughnut';

export type ChartColor = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
};

export type TableData = {
  headers: string[];
  rows: (string | number)[][];
};

export type Image = {
  id: string;
  url: string;
  description?: string;
  width?: number;
  height?: number;
  // DOM interaction properties
  elementId?: string;
  elementPath?: string;
  pageUrl: string;
  captureTimestamp: number;
  // Position information for scrolling
  boundingRect?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

export type Chart = {
  id: string;
  name: string;
  description: string;
  image: Image;
  // Chart specific properties
  type: ChartType;
  data: TableData;
  colors: ChartColor;
  // Customization options
  showLegend: boolean;
  showGrid: boolean;
  showLabels: boolean;
  // Additional metadata
  createdAt: number;
  updatedAt: number;
};

export type Citation = {
  format: CitationFormat;
  content: string;
  url?: string;
  accessedDate?: string;
  authors?: string[];
  title?: string;
  publicationDate?: string;
  publisher?: string;
  location?: string;
  doi?: string;
};

export type Source = {
  id: string;
  name: string;
  description: string;
  citations: Citation[];
  // Source metadata
  url: string;
  type: 'webpage' | 'image' | 'document' | 'other';
  lastAccessed: number;
  // DOM interaction properties
  elementId?: string;
  elementPath?: string;
};
