# 분석 (Analysis)

## 요약
- 요청 내용: `src/server/utils/auth.ts`의 `authHelper` 사용방법 분석
- 범위: `authHelper` 정의, 반환 컨텍스트, 개발/운영 분기, 실제 API 사용 패턴
- 구현 가능성: 가능. 코드 수정 없이 사용 계약을 설명할 수 있다.
- 참조 문서:
  - `.workflow/00-init/2026-03-22-authHelper사용방법분석-초기화.md`
  - `PRD/PRD.md`
  - `PRD/Coding-Rules.md`

## 요구사항 요약
- `authHelper(event)`가 무엇을 반환하는지 파악해야 한다.
- API들이 이 반환값을 어떤 방식으로 사용해 인증과 인가를 처리하는지 정리해야 한다.
- 단순 인증 함수인지, 개발 환경 우회까지 포함한 권한 컨텍스트 생성기인지 구분해야 한다.
- 실제 사용 시 주의할 점과 한계를 함께 드러내야 한다.

## 현재 상태

### 관련 파일
- `src/server/utils/auth.ts`: 요청 헤더의 Discord ID를 기준으로 사용자 조회, 관리자 여부 계산, 소유권 검사 함수 생성, 개발 환경 우회 처리까지 담당하는 핵심 인증/인가 헬퍼다.
- `src/server/utils/request-header.ts`: `getDiscordId(event)`를 통해 요청 헤더에서 Discord ID를 읽는 입력 진입점이다.
- `src/server/utils/access.ts`: `authHelper`가 만든 컨텍스트를 조합해 공통 접근 허용 여부를 판단하는 래퍼다.
- `src/server/api/users/[id].put.ts`: `hasPermission(findUser.id)`와 `isAdmin`을 함께 사용해 본인 수정과 관리자 권한 변경을 분기한다.
- `src/server/api/characters/[id]/classes/index.post.ts`: `hasPermission(character.userId)`만 사용해 자원 소유권 기반 인가를 수행한다.
- `src/server/api/log-histories/index.get.ts`: `isAdmin`만 사용해 관리자 전용 API를 구현한다.
- `src/server/api/sessions/[id]/logs/index.post.ts`: `user`, `isAdmin`, `hasPermission`을 함께 사용해 참가자 여부와 캠페인 소유권, 관리자 대리 작성 권한을 조합한다.
- `src/server/api/users/me.get.ts`: `user`만 구조분해하지만 `error`를 처리하지 않아 사용 계약이 일관되지 않은 예외 사례다.

### 현재 로직 분석

#### 1. 입력과 사용자 해석
- `authHelper(event)`는 먼저 `getDiscordId(event)`로 요청자의 Discord ID를 읽는다.
- 운영 환경에서는 Discord ID가 없으면 `UNAUTHORIZED`, 사용자가 없으면 `USER_NOT_FOUND` 에러를 담은 컨텍스트를 반환한다.
- 사용자가 존재하면 사용자 객체와 권한 검사 함수를 포함한 컨텍스트를 반환한다.

#### 2. 개발 환경 분기
- `NODE_ENV === 'development'`면 인증을 강제하지 않는다.
- 헤더에 Discord ID가 있으면 해당 사용자를 찾고, 없거나 매칭 실패 시 관리자 계정 우선, 없으면 첫 사용자로 대체한다.
- 이 경우 `isDevelopmentBypass`가 `true`이며 `hasPermission`, `canAccessSelf`는 무조건 `true`를 반환한다.
- 즉 개발 환경의 `authHelper`는 인증 검증기보다 테스트용 권한 우회 컨텍스트 생성기에 가깝다.

#### 3. 반환 계약
- `user`: 조회된 사용자 또는 `null`
- `isAdmin`: `ROLE_ADMIN` 또는 `ROLE_SUPER_ADMIN` 여부
- `isDevelopmentBypass`: 개발 환경 우회 여부
- `hasPermission(resourceUserId)`: 관리자이거나 요청 사용자 ID와 자원 소유자 ID가 같으면 `true`
- `checkAdmin()`: `isAdmin` 반환
- `canAccessSelf()`: 개발 우회거나 관리자이거나 자기 자신이면 `true`
- `requireUser()`: 사용자 객체가 있으면 반환, 없으면 `null`
- `error`: 인증 실패 시 `BaseResponse.error(...)`, 성공 시 `null`

#### 4. 실제 사용 패턴 분류
- 패턴 A. 인증만 필요한 경우:
  - `src/server/api/campaigns/index.post.ts`
  - `src/server/api/campaigns/mine.get.ts`
  - `src/server/api/characters/mine.get.ts`
  - 공통 형태는 `const { user, error } = await authHelper(event); if (error) return error;`
- 패턴 B. 관리자 전용 엔드포인트:
  - `src/server/api/log-histories/index.get.ts`
  - `src/server/api/log-histories/[id].get.ts`
  - `const { isAdmin, error } = await authHelper(event); if (!isAdmin) return FORBIDDEN;`
- 패턴 C. 자원 소유권 또는 관리자 권한 확인:
  - `src/server/api/users/[id].put.ts`
  - `src/server/api/campaigns/[id].put.ts`
  - `src/server/api/characters/[id]/classes/index.post.ts`
  - `const { hasPermission, error } = await authHelper(event);` 후 DB에서 자원을 조회한 뒤 `hasPermission(resource.userId)`로 검증한다.
- 패턴 D. 복합 인가:
  - `src/server/api/sessions/[id]/logs/index.post.ts`
  - 세션 참가 여부를 별도 조회하고, 참가자가 아니면 `hasPermission(session.campaign?.userId)`로 캠페인 소유자/관리자만 허용한다.
  - `isAdmin`은 작성 대상 사용자 ID를 다른 사용자로 바꿀 수 있는지 판정하는 추가 조건으로 사용한다.
- 패턴 E. 공통 접근 래핑:
  - `src/server/utils/access.ts`
  - `authHelper`의 `checkAdmin`, `canAccessSelf`, `isDevelopmentBypass`를 다시 조합해 상위 접근 함수로 노출한다.

## 영향도 평가

### 직접 영향
- `authHelper`의 반환 필드명이나 동작을 바꾸면 다수 API가 동시에 영향을 받는다.
- 특히 `hasPermission(resourceUserId)`의 의미가 "자원 소유자 ID와 요청 사용자 ID 비교"라는 계약에 의존하는 엔드포인트가 많다.
- `isAdmin`과 `error` 처리 규약이 바뀌면 로그, 사용자, 캠페인, 세션 API 전반의 인증 흐름이 흔들린다.

### 간접 영향
- 개발 환경 우회 로직 때문에 로컬 테스트에서 인증 실패가 재현되지 않을 수 있다.
- `users/me.get.ts`처럼 `error`를 확인하지 않는 사용처는 운영 환경에서 `user`가 `null`일 수 있어 후속 로직 추가 시 취약점이 될 수 있다.
- `hasPermission(undefined | null)` 호출이 가능한 구조라 관계 객체 누락 시 인가 실패가 조용히 발생할 수 있다.
- `checkAdmin`, `canAccessSelf`, `requireUser`는 현재 사용처가 거의 없거나 제한적이어서 API 표면 대비 실제 소비가 낮다.

## 실행 판단

### 구현 가능성
- 가능
- 현재 코드만으로 `authHelper` 사용방법과 권한 계약을 충분히 설명할 수 있다.

### 예상 기술 난제
- 인증(authentication)과 인가(authorization), 개발 우회가 하나의 헬퍼에 섞여 있어 역할 경계가 흐리다.
- 반환 객체가 넓은 반면 사용처별 필요 필드는 제한적이어서 오용 가능성이 있다.
- 개발 환경 우회 때문에 운영 기준 계약과 로컬 동작이 달라질 수 있다.

### 가정 / 불확실성
- `getDiscordId(event)`의 구체적 헤더 키 구현은 본 분석에서 직접 열람하지 않았고, 함수명과 주석, 사용 패턴을 기준으로 Discord ID 헤더를 읽는다고 판단했다.
- `users/me.get.ts`는 현재 구현이 비어 있어 실제 응답 로직이 미완성일 수 있다.
- context7 MCP는 현재 세션에서 사용할 수 없어 로컬 정적 분석으로 대체했다.

## 결론
- `authHelper`는 단순 인증 함수가 아니라 "요청 사용자 확인 + 관리자 판정 + 자원 소유권 검사 함수 생성 + 개발 환경 우회"를 함께 제공하는 서버용 인증/인가 컨텍스트 팩토리다.
- 실사용의 핵심 규칙은 `await authHelper(event)` 호출 후 먼저 `error`를 반환 처리하고, 이후 `user`, `isAdmin`, `hasPermission(resourceOwnerId)`를 목적에 맞게 조합하는 것이다.
- 가장 흔한 사용법은 `if (error) return error;` 다음 `hasPermission(resource.userId)`로 본인 또는 관리자 여부를 판정하는 패턴이다.
