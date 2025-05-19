# Chart Index Feature

## 개요
웹페이지 내 차트 이미지를 탐지하고 인덱싱하여 사이드 패널에서 쉽게 접근할 수 있도록 하는 기능입니다.

## 담당자
[담당자 이름]

## 주요 기능
- 차트 이미지 탐지 및 인덱싱
- 사이드 패널에서 차트 목록 표시
- 차트 검색 및 필터링
- 차트 클릭 시 해당 위치로 스크롤

## 개발 가이드

### 1. 컴포넌트 구조 (참고)

```
chart-index/
├── components/
│ ├── ChartList.tsx # 차트 목록 표시
│ ├── ChartSearch.tsx # 검색 기능
│ └── ChartNavigation.tsx # 네비게이션
├── hooks/
│ └── useChartIndex.ts # 차트 인덱스 관련 로직
└── types.ts # 타입 정의

```


### 2. 주요 타입 정의
```typescript
interface Chart {
  id: string;
  title: string;
  type: string;
  position: number;
  element: HTMLElement;
}
```

### 3. 개발 순서
1. content script에서 차트 탐지 로직 구현
2. 사이드 패널 UI 컴포넌트 개발
3. 차트 목록 표시 및 검색 기능 구현
4. 스크롤 기능 구현

### 4. API 통신
- content script와의 통신
  ```typescript
  // 차트 탐지 시
  chrome.runtime.sendMessage({
    type: 'CHARTS_DETECTED',
    charts: detectedCharts
  });
  ```

### 5. 스타일링 가이드
- Tailwind CSS 사용
- 반응형 디자인 적용
- 다크 모드 지원

### 6. 테스트 체크리스트
- [ ] 차트 탐지 정확도
- [ ] 검색 기능 동작
- [ ] 스크롤 기능
- [ ] UI 반응성