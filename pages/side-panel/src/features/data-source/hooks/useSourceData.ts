import { useEffect, useState } from 'react';
import { Source } from '../types';

// OCR 텍스트와 DOM 메타 정보를 입력으로 받는 타입
interface RawSourceInput {
  ocrText: string;
  domMeta: {
    src: string; // 이미지 URL
    alt?: string; // 이미지 alt 텍스트
    title?: string; // 이미지 title 속성
    pageUrl: string; // 이미지가 위치한 웹페이지 URL
  };
}

// 출처 데이터를 생성하는 커스텀 훅
export function useSourceData(input: RawSourceInput) {
  const [source, setSource] = useState<Source | null>(null);

  useEffect(() => {
    const generate = async () => {
      const response = await fetch('/api/source/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.ocrText }),
      });

      const data = await response.json();

      setSource({
        title: input.domMeta.title || data.title || '제목 없음',
        url: input.domMeta.pageUrl,
        date: data.date || new Date().toISOString().split('T')[0],
        type: data.type || '기타',
        citation:
          data.citation || `출처: ${input.domMeta.title || '알 수 없음'}, ${new Date().toISOString().split('T')[0]}`,
      });
    };

    generate();
  }, [input]);

  return { source };
}
