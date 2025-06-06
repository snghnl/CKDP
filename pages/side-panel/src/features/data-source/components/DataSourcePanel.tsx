import React, { useEffect } from 'react';
import { Citation, CitationFormat } from '@extension/shared';
import { Check } from 'lucide-react';

interface DataSourcePanelProps {
  citations: Citation[];
}

export const DataSourcePanel: React.FC<DataSourcePanelProps> = ({ citations }) => {
  const [copiedFormat, setCopiedFormat] = React.useState<CitationFormat | null>(null);

  useEffect(() => {
    console.log('citations', citations);
  }, [citations]);

  const handleCopy = async (citation: Citation) => {
    try {
      await navigator.clipboard.writeText(citation.text);
      setCopiedFormat(citation.format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {citations.map(citation => (
        <div
          key={citation.format}
          onClick={() => handleCopy(citation)}
          className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">{citation.format}</h3>
            {copiedFormat === citation.format && <Check size={18} className="text-green-500" />}
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{citation.text}</p>
        </div>
      ))}
    </div>
  );
};
