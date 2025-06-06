//ColorPicker.tsx

import { useState } from 'react';

// 부드러운 무지개 색상 (빨주노초 순서 반영 및 개선)
const predefinedColors = [
  '#FF6347', // 빨강 (Tomato)
  '#FF7F50', // 주황 (Coral)
  '#FFD700', // 노랑 (Gold)
  '#9ACD32', // 연두 (YellowGreen)
  '#66CDAA', // 초록 (MediumAquamarine)
  '#00CED1', // 청록 (DarkTurquoise)
  '#4682B4', // 파랑 (SteelBlue)
  '#8A2BE2', // 보라 (BlueViolet)
  '#FF69B4', // 분홍 (HotPink)
  '#E9967A', // 주황빛 갈색 (DarkSalmon)
  '#ADFF2F', // 연두색 (GreenYellow)
  '#1E90FF', // 파란색 (DodgerBlue)
];

interface ColorPickerProps {
  show: boolean;
  onClose: () => void;
  onColorChange: (color: string) => void;
  selectedColor?: string;
  userCustomColors: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  show,
  onClose,
  onColorChange,
  selectedColor,
  userCustomColors,
}) => {
  const [customColor, setCustomColor] = useState<string>(selectedColor || '#000000');

  const handleCustomChange = (color: string) => {
    setCustomColor(color);
    onColorChange(color);
  };

  if (!show) return null;

  return (
    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 min-w-[280px]">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-3">색상</label>
        <div className="grid grid-cols-6 gap-2">
          {predefinedColors.map(color => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? '#374151' : '#d1d5db',
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-3">사용자 지정 색상</label>
        <div className="grid grid-cols-6 gap-2 mb-3">
          {userCustomColors.map((color, index) => (
            <button
              key={`user-${index}`}
              onClick={() => onColorChange(color)}
              className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? '#374151' : '#d1d5db',
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">팔레트</label>
        <input
          type="color"
          value={customColor}
          onChange={e => handleCustomChange(e.target.value)}
          className="w-1/3 h-10 rounded-md cursor-pointer"
        />
      </div>

      <button
        onClick={onClose}
        className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors">
        닫기
      </button>
    </div>
  );
};
