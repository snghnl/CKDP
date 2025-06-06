// Type definitions
export interface Image {
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

export interface SavedImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  directory: string;
  savedAt: string;
}

export interface Chart {
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

export interface ChartData {
  headers: string[];
  rows: string[][];
}

export type ChartView = 'table' | 'bar' | 'line' | 'area' | 'pie';
export type BarDirection = 'vertical' | 'horizontal';

export interface ColorPickerProps {
  colorIndex: number; // ✅ 추가됨
  currentColor: string;
  onColorChange: (colorIndex: number, color: string) => void; // ✅ 함수 시그니처 수정됨
  onClose: () => void;
  userCustomColors: string[];
}

export interface ShowColorPickerState {
  [key: number]: boolean;
}

export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE' | 'Vancouver' | 'Turabian';

export type SourceType = 'webpage' | 'image' | 'document' | 'other';

export interface Citation {
  format: CitationFormat;
  text: string;
  url?: string;
}

export interface Source {
  id: string;
  name: string;
  description: string;
  url: string;
  citations: Citation[];
  selectedFormat?: CitationFormat;
}

export interface SourceDisplayProps {
  source: Source;
  selectedFormat: CitationFormat;
  onFormatChange: (format: CitationFormat) => void;
}

export interface CitationListProps {
  sources: Source[];
  selectedFormat: CitationFormat;
  onFormatChange: (format: CitationFormat) => void;
  onExport: () => void;
}

export interface ExportOptionsProps {
  onExport: (format: string) => void;
  availableFormats: string[];
}

export interface SourceData {
  sources: Source[];
  loading: boolean;
  error: string | null;
}

export interface ResponseData {
  headers: string[];
  rows: {
    cells: string[];
  }[];
  citations: {
    APA: string;
    MLA: string;
    Chicago: string;
    Harvard: string;
    IEEE: string;
    Turabian: string;
    Vancouver: string;
  };
}
