import { useState, useEffect } from 'react';
import { Source, CitationFormat } from '../types';
import { mockSources } from '../mockData';

// Mock 데이터 서비스
class MockSourceService {
  private static sources: Source[] = mockSources;

  static async getSources(): Promise<Source[]> {
    // 실제 구현에서는 API 호출이 들어갈 것입니다
    return new Promise(resolve => {
      setTimeout(() => resolve(this.sources), 500);
    });
  }

  static async addSource(source: Omit<Source, 'id'>): Promise<Source> {
    const newSource = {
      ...source,
      id: Math.random().toString(36).substr(2, 9),
    };
    this.sources.push(newSource);
    return newSource;
  }

  static async updateSource(id: string, source: Partial<Source>): Promise<Source | undefined> {
    const index = this.sources.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    this.sources[index] = { ...this.sources[index], ...source };
    return this.sources[index];
  }

  static async deleteSource(id: string): Promise<boolean> {
    const index = this.sources.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.sources.splice(index, 1);
    return true;
  }
}

export const useSourceData = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSources = async () => {
      try {
        // 초기 데이터 로드 시 각 출처의 기본 인용 형식을 'APA'로 설정
        const sourcesWithFormat = mockSources.map(source => ({
          ...source,
          selectedFormat: 'APA' as CitationFormat,
        }));
        setSources(sourcesWithFormat);
        setLoading(false);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    loadSources();
  }, []);

  const updateSourceFormat = (sourceId: string, format: CitationFormat) => {
    setSources(prevSources =>
      prevSources.map(source => (source.id === sourceId ? { ...source, selectedFormat: format } : source)),
    );
  };

  const updateAllFormats = (format: CitationFormat) => {
    setSources(prevSources =>
      prevSources.map(source => ({
        ...source,
        selectedFormat: format,
      })),
    );
  };

  return {
    sources,
    loading,
    error,
    updateSourceFormat,
    updateAllFormats,
  };
};
