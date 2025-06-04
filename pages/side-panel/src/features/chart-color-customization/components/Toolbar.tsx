import { Palette } from 'lucide-react';
import { ChartView, BarDirection, ShowColorPickerState } from '../types';
import { ColorPicker } from './ColorPicker';

// 부드러운 무지개 색상
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

interface ToolbarProps {
  view: ChartView;
  onViewChange: (view: ChartView) => void;
  barDirection: BarDirection;
  onBarDirectionChange: (direction: BarDirection) => void;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  gridInterval: number | 'auto';
  gridIntervalInput: string;
  onGridIntervalInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  colors: string[];
  requiredColorCount: number;
  showColorPicker: ShowColorPickerState;
  onToggleColorPicker: (colorIndex: number) => void;
  onColorChange: (colorIndex: number, color: string) => void;
  userCustomColors: string[];
  onUpdateUserCustomColors: (colors: string[]) => void;
}

export const Toolbar = ({
  view,
  onViewChange,
  barDirection,
  onBarDirectionChange,
  showGrid,
  onShowGridChange,
  gridInterval,
  gridIntervalInput,
  onGridIntervalInputChange,
  colors,
  requiredColorCount,
  showColorPicker,
  onToggleColorPicker,
  onColorChange,
  userCustomColors,
  onUpdateUserCustomColors,
}: ToolbarProps) => {
  return (
    <>
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'table' as ChartView, label: '테이블' },
            { key: 'bar' as ChartView, label: '막대 차트' },
            { key: 'line' as ChartView, label: '선 차트' },
            { key: 'area' as ChartView, label: '영역 차트' },
            { key: 'pie' as ChartView, label: '원형 차트' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                view === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 차트 옵션 */}
      {view !== 'table' && (
        <div className="mb-4 flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
          {/* 막대 차트 방향 설정 */}
          {view === 'bar' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">방향:</label>
              <button
                className={`px-3 py-1 rounded ${
                  barDirection === 'vertical' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => onBarDirectionChange('vertical')}>
                세로
              </button>
              <button
                className={`ml-2 px-3 py-1 rounded ${
                  barDirection === 'horizontal' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => onBarDirectionChange('horizontal')}>
                가로
              </button>
            </div>
          )}

          {/* 그리드 표시 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showGrid"
              checked={showGrid}
              onChange={e => onShowGridChange(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showGrid" className="text-sm font-medium">
              그리드 표시
            </label>
          </div>

          {/* 그리드 간격 설정 */}
          {showGrid && (view === 'bar' || view === 'line' || view === 'area') && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">그리드 간격:</label>
              <input
                type="text"
                value={gridIntervalInput}
                onChange={onGridIntervalInputChange}
                placeholder="auto"
                className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
              />
              <span className="text-xs text-gray-500">(auto 또는 숫자)</span>
            </div>
          )}

          {/* 색상 설정 */}
          <div className="flex items-center gap-2 relative">
            <span className="text-sm font-medium">색상:</span>
            <div className="flex gap-2">
              {Array.from({ length: requiredColorCount }, (_, index) => {
                const color = colors[index] || predefinedColors[index % predefinedColors.length];
                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => onToggleColorPicker(index)}
                      className="w-8 h-8 rounded-md border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
                      style={{ backgroundColor: color }}>
                      <Palette size={12} className="text-white drop-shadow-sm" />
                    </button>
                    {showColorPicker[index] && (
                      <ColorPicker
                        colorIndex={index}
                        currentColor={color}
                        onColorChange={onColorChange}
                        onClose={() => onToggleColorPicker(index)}
                        userCustomColors={userCustomColors}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
