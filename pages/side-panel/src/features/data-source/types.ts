export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE';

export type SourceType = 'webpage' | 'image' | 'document' | 'other';

export interface Citation {
  format: CitationFormat;
  text: string;
  url?: string;
}

export interface Image {
  id: string;
  url: string;
  description?: string;
  width?: number;
  height?: number;
  elementId?: string;
  elementPath?: string;
  pageUrl: string;
  captureTimestamp: number;
  boundingRect?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
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
