interface Props {
  count: number;
}

export function ChartNavigation({ count }: Props) {
  return <div className="text-xs text-gray-600 mt-2">총 {count}개의 도표를 찾았습니다.</div>;
}
