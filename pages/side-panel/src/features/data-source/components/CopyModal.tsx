import React from 'react';
import { X } from 'lucide-react';

interface CopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
  citationText: string;
}

export const CopyModal: React.FC<CopyModalProps> = ({ isOpen, onClose, onCopy, citationText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">인용문 복사</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">다음 인용문을 복사하시겠습니까?</p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm whitespace-pre-wrap">{citationText}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            취소
          </button>
          <button
            onClick={onCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            복사하기
          </button>
        </div>
      </div>
    </div>
  );
};
