import { useEffect, useState } from 'react';
import { ToggleButton } from '@extension/ui';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';

export default function App() {
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  const handleImageSelect = () => {
    setIsSelecting(true);
    chrome.runtime.sendMessage({ type: 'ENABLE_IMAGE_SELECT' });
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded bg-blue-100 px-2 py-1">
      <div className="flex gap-1 text-blue-500">
        {isSelecting ? (
          <span>이미지 선택 중...</span>
        ) : (
          <button onClick={handleImageSelect} className="text-blue-700 hover:text-blue-900">
            이미지 선택하기
          </button>
        )}
      </div>
      <ToggleButton onClick={exampleThemeStorage.toggle}>{t('toggleTheme')}</ToggleButton>
    </div>
  );
}
