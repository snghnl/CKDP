import { useState } from 'react';
import { CitationFormat, CitationInput } from './types';
import { generateCitations } from './utils/citationGenerator';

export function DataSource() {
  const [citationInput, setCitationInput] = useState<CitationInput>({
    author: '',
    title: '',
    year: '',
    publisher: '',
    url: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
  });

  const [citations, setCitations] = useState<Record<CitationFormat, string>>({} as Record<CitationFormat, string>);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCitationInput(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    const generatedCitations = generateCitations(citationInput);
    setCitations(generatedCitations);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">출처 표기 생성기</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">저자</label>
          <textarea
            name="author"
            value={citationInput.author}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={1}
            placeholder="저자명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <textarea
            name="title"
            value={citationInput.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={1}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">발행년도</label>
          <textarea
            name="year"
            value={citationInput.year}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={1}
            placeholder="발행년도를 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">출판사/저널</label>
          <textarea
            name="publisher"
            value={citationInput.publisher}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={1}
            placeholder="출판사 또는 저널명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <textarea
            name="url"
            value={citationInput.url}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={1}
            placeholder="URL을 입력하세요"
          />
        </div>

        <button onClick={handleGenerate} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          인용문 생성
        </button>

        {Object.entries(citations).length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">생성된 인용문</h3>
            {Object.entries(citations).map(([format, text]) => (
              <div key={format} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{format}</span>
                  <button onClick={() => handleCopy(text)} className="text-sm text-blue-500 hover:text-blue-600">
                    복사
                  </button>
                </div>
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
