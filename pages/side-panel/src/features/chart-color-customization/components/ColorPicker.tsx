import { useState } from 'react';
import { ColorPickerProps } from '../types';

const predefinedColors = [
  '#4CAF50',
  '#2196F3',
  '#FF5722',
  '#9C27B0',
  '#FF9800',
  '#607D8B',
  '#e57373',
  '#ffb74d',
  '#fff176',
  '#81c784',
  '#64b5f6',
  '#9575cd',
];

export const ColorPicker = ({
  colorIndex, // ✅ 추가
  currentColor,
  onColorChange,
  onClose,
  userCustomColors,
}: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState<string>(currentColor);

  const handleCustomChange = (color: string) => {
    setCustomColor(color);
    onColorChange(colorIndex, color); // ✅ colorIndex 포함해서 전달
  };

  return (
    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 min-w-[280px]">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-3">색상</label>
        <div className="grid grid-cols-6 gap-2">
          {predefinedColors.map(color => (
            <button
              key={color}
              onClick={() => onColorChange(colorIndex, color)} // ✅ 고침
              className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: currentColor === color ? '#374151' : '#d1d5db',
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
              onClick={() => onColorChange(colorIndex, color)}
              className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                borderColor: currentColor === color ? '#374151' : '#d1d5db',
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
          className="w-1/3 h-10 rounded-md  cursor-pointer"
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
