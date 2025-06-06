//Toolbar.tsx

import { Palette, Bot } from 'lucide-react';
import { ChartView, BarDirection, ShowColorPickerState } from '../types';
import { ColorPicker } from './ColorPicker';
import { TableChart, BarChart, ShowChart, PieChart, AreaChart } from '@mui/icons-material';
import { IconButton, Tooltip, Paper } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useRef, useState } from 'react';

// 부드러운 무지개 색상
const predefinedColors = [
  '#FF6347', // Tomato (빨)
  '#FF8C00', // DarkOrange (주)
  '#FFD700', // Gold (노)
  '#32CD32', // LimeGreen (초)
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
  showColorPicker: boolean;
  onToggleColorPicker: (show: boolean) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoStyle = async (file: File) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://ckdp-backend-1071583860130.europe-west1.run.app/pdf/extract-colors', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();

      if (data.dominant_colors && Array.isArray(data.dominant_colors)) {
        // Store the received colors in userCustomColors
        onUpdateUserCustomColors(data.dominant_colors);

        // Apply the colors to the chart
        data.dominant_colors.forEach((color: string, index: number) => {
          onColorChange(index, color);
        });
      }
    } catch (error) {
      console.error('Error in auto styling:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      handleAutoStyle(file);
    }
  };

  return (
    <Paper
      elevation={0}
      className="mb-4 p-4 bg-white rounded-xl border border-gray-100"
      sx={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}>
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-100 mb-4">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'table' as ChartView, icon: <TableChart /> },
            { key: 'bar' as ChartView, icon: <BarChart /> },
            { key: 'line' as ChartView, icon: <ShowChart /> },
            { key: 'area' as ChartView, icon: <AreaChart /> },
            { key: 'pie' as ChartView, icon: <PieChart /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center justify-center transition-all duration-200 ${
                view === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              {tab.icon}
            </button>
          ))}
        </nav>
      </div>

      {/* 차트 옵션 */}
      {view !== 'table' && (
        <div className="flex flex-wrap gap-6 items-center">
          {/* 막대 차트 방향 설정 */}
          {view === 'bar' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">방향:</label>
              <Tooltip title={barDirection === 'vertical' ? '가로 방향으로 변경' : '세로 방향으로 변경'}>
                <IconButton
                  size="small"
                  onClick={() => onBarDirectionChange(barDirection === 'vertical' ? 'horizontal' : 'vertical')}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'all 0.2s ease',
                  }}>
                  {barDirection === 'vertical' ? <SwapHorizIcon /> : <SwapVertIcon />}
                </IconButton>
              </Tooltip>
            </div>
          )}

          {/* 그리드 표시 설정 */}
          {view !== 'pie' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">그리드:</label>
              <button
                onClick={() => onShowGridChange(!showGrid)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showGrid ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                {showGrid ? '표시' : '숨김'}
              </button>
            </div>
          )}

          {/* 그리드 간격 설정 */}
          {view !== 'pie' && showGrid && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">간격:</label>
              <input
                type="number"
                value={gridIntervalInput === 'auto' ? '' : gridIntervalInput}
                onChange={e => onGridIntervalInputChange(e)}
                className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                min="1"
                max="100"
              />
            </div>
          )}

          {/* 색상 설정 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">색상:</label>
            <button
              onClick={() => onToggleColorPicker(!showColorPicker)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200">
              <Palette size={16} />
              <span>커스텀</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              <Bot size={16} />
              <span>{isLoading ? '처리 중...' : '자동 스타일링'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 색상 선택기 */}
      {showColorPicker && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <ColorPicker
            colorIndex={0}
            currentColor={colors[0] || '#000000'}
            onColorChange={onColorChange}
            onClose={() => onToggleColorPicker(false)}
            userCustomColors={userCustomColors}
          />
        </div>
      )}
    </Paper>
  );
};
