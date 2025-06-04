import { Plus, Trash2 } from 'lucide-react';
import { ChartData } from '../types';

interface ChartTableProps {
  tableData: ChartData;
  onCellEdit: (rowIndex: number, colIndex: number, value: string) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
}

export const ChartTable = ({ tableData, onCellEdit, onAddRow, onDeleteRow }: ChartTableProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">데이터 편집</h3>
        <button
          onClick={onAddRow}
          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
          <Plus size={14} />행 추가
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th key={index} className="border border-gray-300 px-2 py-1 bg-gray-100 text-sm font-medium">
                  {header}
                </th>
              ))}
              <th className="border border-gray-300 px-2 py-1 bg-gray-100 text-sm font-medium w-12">삭제</th>
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 px-1 py-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={e => onCellEdit(rowIndex, colIndex, e.target.value)}
                      className="w-full px-2 py-1 border-none outline-none text-sm bg-transparent"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 px-1 py-1 text-center">
                  <button onClick={() => onDeleteRow(rowIndex)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
