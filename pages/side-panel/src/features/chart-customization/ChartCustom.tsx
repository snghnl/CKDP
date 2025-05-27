import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Palette } from 'lucide-react';

// sample data
const sampleData = [
  { name: '1월', sales: 4000, profit: 2400 },
  { name: '2월', sales: 3000, profit: 1398 },
  { name: '3월', sales: 2000, profit: 9800 },
  { name: '4월', sales: 2780, profit: 3908 },
  { name: '5월', sales: 1890, profit: 4800 },
  { name: '6월', sales: 2390, profit: 3800 },
];

const predefinedColors = [
  '#ef4444', // red
  '#000000', // black
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // orangex
  '#8b5cf6', // purple
];

// 타입 정의
type ChartType = 'sales' | 'profit';

interface ColorPickerProps {
  type: ChartType;
  currentColor: string;
  onColorChange: (color: string) => void;
  close: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ type, currentColor, onColorChange, close }) => {
  const [customColor, setCustomColor] = useState(currentColor);

  const handleCustomChange = (color: string) => {
    setCustomColor(color);
    onColorChange(color);
  };

  return (
    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-10 min-w-[250px]">
      <div>
        <label className="block text-sm font-medium mb-2">색상 선택</label>
        <input
          type="color"
          value={customColor}
          onChange={e => handleCustomChange(e.target.value)}
          className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
        />
      </div>

      <button
        onClick={close}
        className="mt-3 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors">
        닫기
      </button>
    </div>
  );
};

export function ChartCustom() {
  const [salesColor, setSalesColor] = useState('#3b82f6');
  const [profitColor, setProfitColor] = useState('#10b981');
  const [showColorPicker, setShowColorPicker] = useState<{ [key in ChartType]: boolean }>({
    sales: false,
    profit: false,
  });

  const handleColorChange = (type: ChartType, color: string) => {
    if (type === 'sales') setSalesColor(color);
    else setProfitColor(color);
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6">Chart Customization</h2>

      {/* 색상 설정 영역 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">차트 색상 설정</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['sales', 'profit'] as ChartType[]).map(type => {
            const currentColor = type === 'sales' ? salesColor : profitColor;
            return (
              <div key={type}>
                <label className="block text-sm font-medium mb-3 capitalize">{type} 색상</label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {predefinedColors.slice(type === 'sales' ? 0 : 3, type === 'sales' ? 3 : 6).map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(type, color)}
                        className="w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: color,
                          borderColor: currentColor === color ? '#374151' : '#d1d5db',
                        }}
                        title={color}
                      />
                    ))}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowColorPicker(prev => ({
                          ...prev,
                          [type]: !prev[type],
                        }))
                      }
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Palette size={16} />
                      <span className="text-sm">팔레트</span>
                    </button>

                    {showColorPicker[type] && (
                      <ColorPicker
                        type={type}
                        currentColor={currentColor}
                        onColorChange={color => handleColorChange(type, color)}
                        close={() =>
                          setShowColorPicker(prev => ({
                            ...prev,
                            [type]: false,
                          }))
                        }
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>현재:</span>
                    <div className="w-6 h-6 rounded border" style={{ backgroundColor: currentColor }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">월별 매출 및 수익 현황</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill={salesColor} name="매출" />
            <Bar dataKey="profit" fill={profitColor} name="수익" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 테이블 영역 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">원본 데이터</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border-b text-left">월</th>
                <th className="px-4 py-2 border-b text-left">매출</th>
                <th className="px-4 py-2 border-b text-left">수익</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{row.name}</td>
                  <td className="px-4 py-2 border-b">{row.sales.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{row.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
