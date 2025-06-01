import { Source } from '../types';

// 출처를 복사하거나 추후 내보내기할 수 있도록 지원하는 버튼 UI
export function ExportOptions({ sources }: { sources: Source[] }) {
  const handleCopy = () => {
    const text = sources.map(s => s.citation).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-4 flex gap-2">
      <button onClick={handleCopy} className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
        출처 복사
      </button>
      {/* 추후 PDF 다운로드 등 내보내기 옵션 추가 가능 */}
    </div>
  );
}
