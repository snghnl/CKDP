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
