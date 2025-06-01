import { Source } from '../types';
import { SourceDisplay } from './SourceDisplay';

// 복수의 출처 정보를 리스트 형태로 출력하는 컴포넌트
export function CitationList({ sources }: { sources: Source[] }) {
  return (
    <div className="space-y-2">
      {sources.map((src, idx) => (
        <SourceDisplay key={idx} source={src} />
      ))}
    </div>
  );
}
