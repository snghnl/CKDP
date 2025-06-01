import { Source } from '../types';

// 하나의 출처 정보를 화면에 표시하는 컴포넌트
export function SourceDisplay({ source }: { source: Source | null }) {
  if (!source) return <p className="text-gray-400">출처를 분석 중입니다...</p>;

  return (
    <div className="p-4 border rounded-xl bg-white shadow">
      <p className="text-sm text-gray-500">{source.citation}</p>
      <p className="text-xs text-gray-400 mt-1">
        ({source.title} · {source.date})
      </p>
    </div>
  );
}
