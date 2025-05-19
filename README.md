# 크롬 익스텐션(Material Picker) 개발 팀 가이드

## 소개

이 프로젝트는 [Chrome Extension boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)를 기반으로 하여 React + TypeScript + Vite 조합으로 크롬 확장 프로그램을 개발하는 프로젝트입니다. Vite와 Turborepo를 활용하여 빠른 빌드 속도와 모듈화된 개발 환경을 제공합니다.

> 이 보일러플레이트는 React와 TypeScript를 사용하여 Chrome/Firefox 확장 프로그램을 만드는 데 도움을 줍니다. Vite와 Turborepo를 사용하여 빌드 속도와 개발 경험을 향상시킵니다.

## 주요 기술 스택 및 기능

* [React 19](https://reactjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Vite](https://vitejs.dev/) with [Rollup](https://rollupjs.org/)
* [Turborepo](https://turbo.build/repo)
* [Prettier](https://prettier.io/) & [ESLint](https://eslint.org/)
* [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
* 사이드 패널, content script, popup 등 다양한 확장 구조 대응

## 1. 프로젝트 개요

**프로젝트명:** Material Picker

**목표:**
웹페이지 내 이미지 형태로 삽입된 차트 데이터를 사용자가 쉽게 접근, 커스터마이징 및 출처 확인할 수 있도록 지원하는 Chrome 확장 프로그램 개발

**팀 구성:** 총 4명

* chart-index 담당자 
* chart-customization 담당자 
* data-source 담당자
* 아키텍처 설계 및 백엔드 담당 

**기능 설명:**

1. **차트 인덱싱**: `<img>` 태그로 삽입된 차트를 탐지하여 사이드 패널에서 바로 접근 가능하도록 인덱스 생성
2. **차트 커스터마이징**: 이미지 차트를 서버로 보내 OCR/LLM 분석 후 테이블화하고 다양한 형태로 시각화 및 색상 변경 가능
3. **데이터 출처 생성**: DOM 분석 및 이미지 OCR 결과를 통해 자동으로 데이터 출처 문장 생성

## 2. 크롬 익스텐션 구조 완전 정복

### Manifest V3

크롬 확장 프로그램의 핵심 설정 파일로, 확장 프로그램의 권한, script 연결 정보 등을 정의합니다.

### 주요 모듈 설명

#### ✅ `content script` (`pages/content/`)

* 현재 웹페이지에 삽입되어 DOM 접근 가능
* 이미지 차트 탐색, 클릭 이벤트 감지
* `chrome.runtime.sendMessage()` 등을 이용해 백그라운드 혹은 사이드패널과 통신

#### ✅ `side-panel` (`pages/side-panel/`)

* 크롬 114 이상에서 지원되는 사이드뷰 패널
* Material Picker의 주요 UI: 차트 목록, 커스터마이징 툴, 데이터 출처 표시

#### ✅ `content-ui` (`pages/content-ui/`)

* 웹페이지에 삽입되는 React UI (예: 이미지 위에 뜨는 버튼)
* Shadow DOM 기반 삽입 가능

#### ✅ `background` (`chrome-extension/src/background/`)

* 브라우저 백그라운드에서 항상 동작하는 JS 환경
* API 통신, 알림, 이벤트 핸들링 등을 담당

#### ✅ `packages` (공통 코드)

* `shared/`: 유틸, 타입, 상수, 훅 등 공통 코드
* `storage/`: `chrome.storage` 연동을 위한 헬퍼
* `ui/`: 팀 공통 UI 컴포넌트 모음
* `env/`, `hmr/`, `i18n/`: 환경 변수, HMR, 다국어 처리

### 디렉토리 구조 예시

```bash
pages/
├── side-panel/
│   └── src/
│       ├── components/              # 공통 UI 컴포넌트
│       └── features/
│           ├── chart-index/
│           ├── chart-customization/
│           └── data-source/
├── content/
│   └── src/
│       ├── chart-detector.ts
│       └── image-capture.ts
└── content-ui/
    └── src/
        └── index.tsx
```

## 3. 개발 환경 설정

### 설치 순서

```bash
git clone []
cd []
pnpm install
```

* `pnpm dev`: 개발 서버 실행
* `pnpm build`: 배포용 빌드

크롬에서 테스트하기:

1. `chrome://extensions` 접속
2. '개발자 모드' 활성화
3. '압축 해제된 확장 프로그램 로드' → `dist` 디렉토리 선택

### 의존성 설치

* 루트: `pnpm i <package> -w`
* 모듈별: `pnpm i <package> -F <module>`

### 환경변수 설정

* `.env` 또는 `packages/env` 참고

## 4. 협업 전략 및 역할 분담

### 역할 예시

* **chart-index**: content script 내 이미지 탐색 로직, 인덱싱 UI
* **chart-customization**: content-ui의 이미지 클릭 핸들링, 서버 API 호출 및 chart 렌더링
* **data-source**: DOM 및 OCR 텍스트 파싱 → 출처 문장 생성, 관련 UI 구성
* **PM/backend**: 전체 message flow 설계, 백엔드 구현 (OCR, LLM 연동 포함)

### 협업 팁

* 공통 컴포넌트는 `packages/ui`에 저장
* `chrome.runtime.sendMessage` 사용 시 message type/interface 명확하게 정의
* `pnpm module-manager`로 사용하지 않는 기능 제거
* Git PR 시 간단한 동작 캡쳐 첨부 권장

## 5. 자주 마주치는 문제 해결법

### 🔄 HMR(핫 리로드) 동작 안 할 때

* `pnpm dev` 재실행
* `turbo` 프로세스 수동 종료 필요 시: 프로세스 확인 후 수동 kill

## 6. 참고 자료 모음

* [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
* [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
* [Rollup Plugin](https://www.extend-chrome.dev/rollup-plugin)
* [Turborepo](https://turbo.build/repo/docs)

