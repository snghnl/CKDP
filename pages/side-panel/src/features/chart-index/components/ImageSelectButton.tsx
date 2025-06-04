import React from 'react';

export const ImageSelectButton = () => {
  const handleActivate = () => {
    chrome.runtime.sendMessage({ type: 'ACTIVATE_IMAGE_SELECT_MODE' });
  };

  return (
    <button onClick={handleActivate} className="px-3 py-2 bg-blue-500 text-white rounded">
      이미지 선택 모드
    </button>
  );
};
