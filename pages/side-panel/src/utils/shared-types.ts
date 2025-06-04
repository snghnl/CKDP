export interface Chart {
  name: string;
  data: {
    headers: string[];
    rows: (string | number)[][];
  };
  showGrid: boolean;
  colors: {
    primary: string;
  };
}
