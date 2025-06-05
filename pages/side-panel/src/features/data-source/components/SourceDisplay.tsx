import React, { useState } from 'react';
import { Source, CitationFormat } from '../types';
import { Copy, Check } from 'lucide-react';
import { CopyModal } from './CopyModal';

interface SourceDisplayProps {
  source: Source;
  selectedFormat: CitationFormat;
  onFormatChange: (format: CitationFormat) => void;
}

export const SourceDisplay: React.FC<SourceDisplayProps> = ({ source, selectedFormat, onFormatChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const citation = source.citations.find(c => c.format === selectedFormat)?.text || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setIsModalOpen(false);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{source.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{source.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedFormat}
            onChange={e => onFormatChange(e.target.value as CitationFormat)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="APA">APA</option>
            <option value="MLA">MLA</option>
            <option value="Chicago">Chicago</option>
            <option value="Harvard">Harvard</option>
            <option value="IEEE">IEEE</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors">
            {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-700">
        <p className="whitespace-pre-wrap">{citation}</p>
      </div>

      <CopyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCopy={handleCopy}
        citationText={citation}
      />
    </div>
  );
};
