# Data Source Feature

## 개요
차트 데이터의 출처를 자동으로 생성하고 관리하는 기능입니다.

## 담당자
[담당자 이름]

## 주요 기능
- DOM 분석을 통한 데이터 출처 추출
- OCR 결과 기반 출처 생성
- 인용 형식 관리
- 출처 내보내기

## 개발 가이드

### 1. 컴포넌트 구조
```
data-source/
├── components/
│ ├── SourceDisplay.tsx # 출처 표시
│ ├── CitationList.tsx # 인용 목록
│ └── ExportOptions.tsx # 내보내기 옵션
├── hooks/
│ └── useSourceData.ts
└── types.ts
```

### 2. 주요 타입 정의
```typescript
interface Source {
  title: string;
  url: string;
  date: string;
  type: string;
  citation: string;
}
```

### 3. 개발 순서
1. DOM 분석 로직 구현
2. 출처 생성 로직 구현
3. UI 컴포넌트 개발
4. 내보내기 기능 구현

### 4. API 통신
- OCR 결과 처리
  ```typescript
  const generateSource = async (text: string) => {
    const response = await fetch('/api/source/generate', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    return response.json();
  };
  ```

### 5. 스타일링 가이드
- 인용 스타일 적용
- 반응형 디자인
- 접근성 고려

### 6. 테스트 체크리스트
- [ ] 출처 생성 정확도
- [ ] 인용 형식
- [ ] 내보내기 기능
- [ ] UI 반응성