# Coding Rules & Guidelines

## 1. 아키텍처 원칙 (Architecture)
- **통합 풀스택 접근**: 외부 API 서버 분리 없이 Nuxt 3(Ninja/Nitro 엔진) 내 `server/api/` 경로를 통해 통합 API 인프라 구성.
- **데이터 레이어**: Drizzle ORM을 이용해 런타임 이전부터 강력한 타입 추론 보장. 프론트엔드와 공유 가능한 스키마 설계 권장 (`app/types/` 또는 공유 모듈 활용).

## 2. 코드 규칙 (Convention)
- **네이밍(Naming) 룰**:
  - Vue 3 SFC (컴포넌트): PascalCase (예: `CampaignCard.vue`)
  - Composable 및 Utils 함수: camelCase (예: `useLogTracker.ts`)
  - API 및 데이터 액션 함수: `getEntity`, `createEntity`, `updateEntity`, `deleteEntity` 형식 유지
  - UI 이벤트 핸들러 함수(클릭, 폼 제출, 입력 변경, 키보드 이벤트 등): `on<Action><Target>` 형식 사용 (예: `onClickSubmit`, `onSelectCampaign`, `onKeydownEscape`)
  - Nuxt 서버 플러그인 또는 API 라우트: 직관적인 URL 매칭을 위한 소문자 및 dot notation 사용 (예: `campaigns.[id].ts`, `logs.get.ts`)
- **주석 보존 (Comment Preservation)**:
  - **CRITICAL**: `server/api/` 폴더 내의 모든 API 파일에서 기존 주석을 제거하지 마십시오.
  - API 엔드포인트에 기술된 로직 설명, 타입 정의, 메타데이터 주석은 유지되어야 합니다.
- **에러 핸들링 (Error Handling)**:
  - 비즈니스 로직(서버 측) 예외는 명시적인 HTTP 상태코드와 함께 Nuxt의 `createError` 함수로 반환하여 일관성 유지.
  - 클라이언트에서는 전역 Error Boundary(에러 페이지) 또는 비동기 컴포저블 내 안전 처리 구현.

## 3. 데이터 패칭 및 캐싱 (Data Fetching & Caching)
- **Vue Query 중심**: 데이터 조회(GET)는 `useQuery`를, 데이터 변경(CUD)은 `useMutation`을 사용하여 관리.
- **커스텀 컴포저블 준수**: 직접 `useQuery`를 호출하기보다 `useGet`, `usePost` 등 프로젝트 표준 커스텀 컴포저블을 사용하여 인터페이스 일관성 유지.
- **쿼리 키 관리**: 하드코딩된 문자열 대신 전역 쿼리 키 팩토리(`query-key-factory`)를 사용하여 키 관리 및 캐시 무효화 수행.
- **캐시 무효화 전략**: 뮤테이션(POST, PUT, DELETE) 성공 시 반드시 관련된 쿼리 키를 무효화(`invalidateQueries`)하여 최신 상태 유지.

## 4. Drizzle ORM 활용
- **테이블 및 관계 정의**: 테이블 선언 및 관계(Relations) 명시를 깔끔히 분리.
- **데이터 일관성**: 데이터 등록(Insert), 갱신(Update) 시 경험치/소비 로그 적재가 동기화되도록 Transaction 또는 트리거 구조 활용 고려.
