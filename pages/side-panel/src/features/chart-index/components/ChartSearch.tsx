interface Props {
  onSearch: (text: string) => void;
}

export function ChartSearch({ onSearch }: Props) {
  return (
    <input
      type="text"
      placeholder="도표 제목 검색"
      className="w-full p-2 border rounded dark:bg-gray-900"
      onChange={e => onSearch(e.target.value)}
    />
  );
}
