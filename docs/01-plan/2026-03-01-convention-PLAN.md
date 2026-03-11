# Phase 2: Coding Rules & Convention (코딩 규칙 분산 및 아키텍처 원칙)

> **목표**: 프로젝트 전반의 코드 스타일과 워크플로우를 통일하여 일관성을 확보합니다.

## 1. 아키텍처 원칙 (Architecture)
- **통합 풀스택 구조**: 외부 API 서버 분리 없이 Nuxt 3 (Nitro 엔진) 내 `server/api/` 경로를 통해 통합 API 인프라 구성.
- **상태 관리**: Pinia 사용 (`@pinia/nuxt`)
- **스타일링**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **데이터 레이어**: Drizzle ORM + PostgreSQL 구성.
  - 타입 유추 강화를 위해 프론트엔드와 공유 가능한 스키마 설계 권장(`app/types/` 또는 공유 모듈 활용).
  - 데이터 등록 및 수정 시 필수 로그(경험치, 소비현황) 추적이 누락되지 않도록 DB 트랜잭션 활용 권장.

## 2. 네이밍 규칙 (Naming Convention)
- **컴포넌트 (Vue 3 SFC)**: `PascalCase` (예: `CampaignCard.vue`, `CharacterProfile.vue`)
- **변수, Composable, Utils 함수**: `camelCase` (예: `useLogTracker()`, `calculateExp`)
- **Nuxt 서버 API 경로**: 라우터 매칭을 위한 직관적인 `소문자` 및 dot notation 사용 (예: `campaigns.[id].ts`, `sessions.get.ts`)
- **상수 (Constants)**: `UPPER_SNAKE_CASE` (예: `MAX_LEVEL_LIMIT`)
- **DB 테이블 및 컬럼 (Drizzle)**: 
  - DB 명칭: `snake_case` (예: `campaign_members`, `user_id`)
  - 코드 상 Property: `camelCase` (예: `campaignMembers`, `userId`)

## 3. 에러 핸들링 (Error Handling)
- **서버 측 (API)**: 비즈니스 로직 예외는 명시적인 HTTP 상태코드와 함께 Nuxt의 `createError()` 함수로 반환하여 일관성 유지.
- **클라이언트 측**: 
  - 전역 Error Boundary(안내 페이지) 사용.
  - 비동기 로직 및 컴포저블 내 안전 처리 구현 (`try-catch` 및 `$fetch` 에러 핸들링 연동).

## 4. Git 워크플로우 및 커밋 규칙 (Git Workflow)
bkit 표준(`git-commit-message` 스킬 호환)을 준수합니다.

- **브랜치 네이밍**: 
  - `feat/`: 새로운 기능 개발
  - `fix/`: 버그 수정
  - `chore/`: 설정 및 패키지 변경
- **커밋 메시지 포맷**:
  ```text
  [YYYY-MM-DD] <type>: <subject>
  
  - <type>: <detail 1>
  - <type>: <detail 2>
  ```
  - 예시: `[2026-03-01] feat: 캠페인 상세 조회 API 구현`

## 5. 포매터 및 린팅 (Lint & Prettier)
- ESLint (Nuxt 생태계 표준 설정 사용)
- EditorConfig 유지보수 (공백 2칸, trailing 줄바꿈 적용 기본 원칙 준수)
