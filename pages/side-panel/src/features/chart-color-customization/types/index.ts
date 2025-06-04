//index.ts
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
