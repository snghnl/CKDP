export interface Chart {
  id: string;
  name: string;
  imageUrl: string;
  alt?: string;
  metadata?: {
    width?: number;
    height?: number;
    alt?: string;
    title?: string;
  };
  markdown?: string;
}
