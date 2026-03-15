# Coding Rules & Guidelines

## 1. 아키텍처 원칙 (Architecture)
- **통합 풀스택 접근**: 외부 API 서버 분리 없이 Nuxt 3(Ninja/Nitro 엔진) 내 `server/api/` 경로를 통해 통합 API 인프라 구성.
- **데이터 레이어**: Drizzle ORM을 이용해 런타임 이전부터 강력한 타입 추론 보장. 프론트엔드와 공유 가능한 스키마 설계 권장 (`app/types/` 또는 공유 모듈 활용).

## 2. 코드 규칙 (Convention)
- **네이밍(Naming) 룰**:
  - Vue 3 SFC (컴포넌트): PascalCase (예: `CampaignCard.vue`)
  - Composable 및 Utils 함수: camelCase (예: `useLogTracker.ts`)
  - Nuxt 서버 플러그인 또는 API 라우트: 직관적인 URL 매칭을 위한 소문자 및 dot notation 사용 (예: `campaigns.[id].ts`, `logs.get.ts`)
- **주석 보존 (Comment Preservation)**:
  - **CRITICAL**: `server/api/` 폴더 내의 모든 API 파일에서 기존 주석을 제거하지 마십시오.
  - API 엔드포인트에 기술된 로직 설명, 타입 정의, 메타데이터 주석은 유지되어야 합니다.
- **에러 핸들링 (Error Handling)**:
  - 비즈니스 로직(서버 측) 예외는 명시적인 HTTP 상태코드와 함께 Nuxt의 `createError` 함수로 반환하여 일관성 유지.
  - 클라이언트에서는 전역 Error Boundary(에러 페이지) 또는 비동기 컴포저블 내 안전 처리 구현.
- **Drizzle ORM 활용**:
  - 테이블 선언 및 관계(Relations) 명시를 깔끔히 분리.
  - 데이터 등록(Insert), 갱신(Update) 시 경험치/소비 로그 적재가 동기화되도록 Transaction 또는 트리거 구조 활용 고려.
