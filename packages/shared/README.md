# Shared Package

This package contains code shared with other packages.
To use the code in the package, you need to add the following to the package.json file.

```json
{
  "dependencies": {
    "@extension/shared": "workspace:*"
  }
}
```

---

## 타입 정의 설명

### Image 타입
이미지 요소의 정보를 저장하는 타입입니다. DOM 트리에서 이미지를 추출하고 관리하는데 사용됩니다.

```typescript
type Image = {
  id: string;              // 이미지 고유 식별자
  url: string;             // 이미지 URL
  description?: string;    // 이미지 설명 (선택)
  width?: number;          // 이미지 너비 (선택)
  height?: number;         // 이미지 높이 (선택)
  elementId?: string;      // DOM 요소 ID (선택)
  elementPath?: string;    // DOM 요소 경로 (선택)
  pageUrl: string;         // 이미지가 있는 페이지 URL
  captureTimestamp: number;// 이미지 캡처 시간
  boundingRect?: {         // 이미지 위치 정보 (선택)
    top: number;           // 상단에서의 거리
    left: number;          // 좌측에서의 거리
    width: number;         // 너비
    height: number;        // 높이
  };
};
```

### Chart 타입
차트 데이터와 시각화 설정을 저장하는 타입입니다. 다양한 차트 타입과 커스터마이징 옵션을 지원합니다.

```typescript
type Chart = {
  id: string;              // 차트 고유 식별자
  name: string;            // 차트 이름
  description: string;     // 차트 설명
  image: Image;            // 관련 이미지
  type: ChartType;         // 차트 타입 (pie, bar, line 등)
  data: TableData;         // 차트 데이터
  colors: ChartColor;      // 색상 설정
  showLegend: boolean;     // 범례 표시 여부
  showGrid: boolean;       // 그리드 표시 여부
  showLabels: boolean;     // 라벨 표시 여부
  createdAt: number;       // 생성 시간
  updatedAt: number;       // 수정 시간
};
```

### Source 타입
출처 정보와 인용 형식을 저장하는 타입입니다. 다양한 인용 스타일(APA, MLA 등)을 지원합니다.

```typescript
type Source = {
  id: string;              // 출처 고유 식별자
  name: string;            // 출처 이름
  description: string;     // 출처 설명
  citations: Citation[];   // 인용 정보 배열
  url: string;             // 출처 URL
  type: 'webpage' | 'image' | 'document' | 'other'; // 출처 타입
  lastAccessed: number;    // 마지막 접근 시간
  elementId?: string;      // DOM 요소 ID (선택)
  elementPath?: string;    // DOM 요소 경로 (선택)
};
```

### Citation 타입
인용 정보를 저장하는 타입입니다. 다양한 인용 형식에 필요한 정보를 포함합니다.

```typescript
type Citation = {
  format: CitationFormat;  // 인용 형식 (APA, MLA, Chicago 등)
  content: string;         // 인용 내용
  url?: string;            // URL (선택)
  accessedDate?: string;   // 접근 날짜 (선택)
  authors?: string[];      // 저자 목록 (선택)
  title?: string;          // 제목 (선택)
  publicationDate?: string;// 발행일 (선택)
  publisher?: string;      // 발행자 (선택)
  location?: string;       // 위치 (선택)
  doi?: string;            // Digital Object Identifier (선택)
};
```

### 지원하는 차트 타입 (ChartType)
- pie: 파이 차트
- bar: 막대 차트
- line: 선 그래프
- scatter: 산점도
- area: 영역 차트
- radar: 레이더 차트
- doughnut: 도넛 차트

### 지원하는 인용 형식 (CitationFormat)
- APA: American Psychological Association
- MLA: Modern Language Association
- Chicago: Chicago Manual of Style
- Harvard: Harvard Referencing
- IEEE: Institute of Electrical and Electronics Engineers
- Turabian: Turabian Style
- Vancouver: Vancouver Style

---

## MockDataService 사용 가이드



1. **임포트 방법**
   ```typescript
   // 전체 타입과 서비스 임포트
   import { MockDataService, Image, Chart, Source } from '@extension/shared';
   
   // 또는 필요한 것만 선택적으로 임포트
   import { MockDataService } from '@extension/shared';
   import type { Image, Chart, Source } from '@extension/shared';
   ```

2. **타입 사용 예시**
   ```typescript
   // 타입을 사용한 함수 정의
   async function displayChart(chart: Chart) {
     // 차트 표시 로직
   }
   
   // 타입을 사용한 변수 정의
   const images: Image[] = await MockDataService.getImages();
   ```

### 기본 사용법

MockDataService는 프론트엔드와 백엔드 개발을 위한 테스트 데이터를 제공합니다. 실제 API가 구현되기 전까지 개발 및 테스트에 사용할 수 있습니다.

```typescript
import { MockDataService } from '@extension/shared';

// 모든 이미지 가져오기
const images = await MockDataService.getImages();

// 특정 ID의 차트 가져오기
const chart = await MockDataService.getChartById('chart1');

// 특정 인용 형식의 출처 가져오기
const apaSources = await MockDataService.getSourcesByCitationFormat('APA');

// 검색 기능 사용하기
const searchResults = await MockDataService.search('sales');
```

### 제공되는 메서드

#### 이미지 관련
- `getImages()`: 모든 이미지 목록 조회
- `getImageById(id: string)`: ID로 특정 이미지 조회

#### 차트 관련
- `getCharts()`: 모든 차트 목록 조회
- `getChartById(id: string)`: ID로 특정 차트 조회
- `getChartsByType(type: ChartType)`: 차트 타입별 조회

#### 출처 관련
- `getSources()`: 모든 출처 목록 조회
- `getSourceById(id: string)`: ID로 특정 출처 조회
- `getSourcesByCitationFormat(format: CitationFormat)`: 인용 형식별 출처 조회

#### 검색
- `search(query: string)`: 모든 데이터 타입에서 검색
  ```typescript
  const results = await MockDataService.search('sales');
  console.log(results.images);    // 이미지 검색 결과
  console.log(results.charts);    // 차트 검색 결과
  console.log(results.sources);   // 출처 검색 결과
  ```

### 테스트 데이터

현재 제공되는 테스트 데이터:

#### 이미지
- 월간 판매 차트 (Q1 2024)
- 매출 성장 비교 차트

#### 차트
- Q1 판매 분석 (막대 차트)
- 매출 성장 (선 그래프)

#### 출처
- Q1 2024 판매 보고서 (APA 형식)
- 연간 매출 분석 (MLA 형식)

### 주의사항

1. 모든 API 호출은 네트워크 지연을 시뮬레이션하기 위해 약간의 지연이 있습니다.
2. 이 서비스는 개발 및 테스트 목적으로만 사용해야 합니다.
3. 실제 API가 구현되면 이 서비스를 실제 API 클라이언트로 교체해야 합니다.

### 예시 코드

```typescript
// 차트 타입별 조회 예시
const barCharts = await MockDataService.getChartsByType('bar');
console.log('Bar Charts:', barCharts);

// 특정 출처의 인용 정보 조회 예시
const source = await MockDataService.getSourceById('src1');
console.log('Citations:', source?.citations);

// 복합 검색 예시
const searchResults = await MockDataService.search('2024');
const matchingCharts = searchResults.charts;
const matchingSources = searchResults.sources;
```
