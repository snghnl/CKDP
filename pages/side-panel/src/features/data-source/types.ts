export interface Source {
  title: string; // 출처 제목 (ex. "한국은행 경제통계시스템")
  url: string; // 출처 링크 (ex. "https://ecos.bok.or.kr")
  date: string; // 수집일 또는 기준일 (ex. "2024-05-31")
  type: string; // 출처 유형 (ex. "공공데이터", "뉴스", "보고서")
  citation: string; // 전체 인용 문장 (ex. "출처: 한국은행 경제통계시스템, 2024-05-31")
}
