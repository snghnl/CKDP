export type CitationFormat = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE';

export interface CitationInput {
  author: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}

export interface Citation {
  format: CitationFormat;
  text: string;
}

export interface Source {
  id: string;
  name: string;
  description: string;
  url: string;
  citations: Citation[];
}
