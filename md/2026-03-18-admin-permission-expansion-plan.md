# Admin Permission Expansion Plan

## 1. 목적

- 기존 API를 유지한 채 전 API에 관리자 권한 우회를 일관되게 적용한다.
- 일반 사용자는 원칙적으로 자기 리소스만 조작한다.
- `ROLE_ADMIN`, `ROLE_SUPER_ADMIN` 사용자는 "자기 것만" 제약을 무시하고 타인 리소스도 조작할 수 있게 한다.
- 별도 어드민 전용 엔드포인트는 만들지 않는다.
- 단, "어드민을 새로 등록시키는 기능"은 이번 범위에서 제외한다.

## 2. 핵심 원칙

### 인증

- 모든 변경성 API는 기존처럼 `X-Discord-ID` 헤더를 통해 요청자 유저를 식별한다.
- `authHelper` 에서 `discordId` 기반 유저 조회 후 `isAdmin` 여부를 판단한다.

### 권한

- 일반 사용자:
- 본인 소유 리소스만 수정, 삭제, 등록, 해제 가능
- 자기 자신에 대한 참여/탈퇴만 가능
- 관리자:
- 소유자 본인 여부, 작성자 본인 여부, path 의 `userId === requester.id` 같은 제약을 무시
- 다른 사람을 캠페인에 추가/제거 가능
- 다른 사람 캐릭터를 캠페인/세션에 등록/해제 가능
- 다른 사람의 세션 로그, 거래, 사용자 정보 등도 기존 API로 조작 가능

### 비범위

- `POST /api/users` 로 `role` 을 받아 어드민을 생성하는 기능 허용
- 일반 사용자가 다른 일반 사용자를 어드민으로 승격하는 기능
- 별도 `/admin/...` 라우트 신설

## 3. 현재 문제 요약

- `authHelper` 자체는 `isAdmin` 과 `hasPermission()` 을 제공하지만, 일부 API가 이를 사용하지 않고 직접 본인 비교를 수행한다.
- 그 결과 어드민 권한이 부분적으로만 동작한다.
- 반대로 일부 API는 일반 사용자가 과하게 넓은 범위를 건드릴 수 있다.

### 대표적인 불일치

- 캠페인 멤버 추가/제거:
- 현재는 본인만 가입/탈퇴 가능
- 어드민의 타인 추가/강제 제거 불가
- 캐릭터 생성/수정:
- 일반 사용자도 `campaignId` 를 직접 넣어 임의 캠페인에 캐릭터를 연결 가능
- 세션 플레이어 추가/제거:
- 현재는 본인 캐릭터만 등록 가능
- 어드민의 타인 캐릭터 등록/제거 불가
- 세션 로그 수정/삭제:
- 현재는 작성자 본인만 가능
- 어드민의 타인 로그 수정/삭제 불가
- 사용자 생성:
- 현재 `role` 을 body 로 받아 저장 가능
- 어드민 승격 취약점이 존재할 수 있음

## 4. 목표 상태

### 공통 정책

- 변경성 API에서 다음 패턴을 공통화한다.
- `const { user, isAdmin, hasPermission, error } = await authHelper(event)`
- "소유권 확인", "작성자 확인", "path userId 자기 자신 확인" 로직은 모두 `isAdmin` 을 고려하도록 통일

### 행위별 기대 동작

- 캠페인 멤버:
- 일반 사용자는 자기 자신만 특정 캠페인에 참여/이탈 가능
- 관리자는 어떤 사용자를 어떤 캠페인에든 추가/제거 가능
- 캠페인 캐릭터:
- 일반 사용자는 자기 캐릭터만 캠페인에 등록/해제 가능하되, 캠페인 권한 정책과 충돌하지 않게 재정의
- 관리자는 어떤 캐릭터든 어떤 캠페인에 등록/해제 가능
- 캐릭터:
- 일반 사용자는 자기 캐릭터만 생성/수정/삭제/상태변경/클래스관리 가능
- 관리자는 타인 캐릭터도 동일 API로 처리 가능
- 세션 플레이어:
- 일반 사용자는 자기 캐릭터만 세션에 등록/제거 가능
- 관리자는 타인 캐릭터도 세션에 등록/제거 가능
- 세션 로그:
- 일반 사용자는 자기 로그만 수정/삭제 가능
- 관리자는 타인 로그도 수정/삭제 가능
- 사용자:
- 일반 사용자는 자기 정보만 수정/삭제 가능
- 관리자는 타인 유저 수정/삭제 가능
- 단, 어드민 역할 부여는 별도 금지 정책 적용

## 5. 적용 전략

### 전략 A. 기존 API 유지 + 권한 분기 정리

- 라우트 구조는 그대로 유지한다.
- 각 API 내부에서 직접 `requester.id !== userId` 식으로 비교하는 코드를 제거하거나 `isAdmin` 조건을 포함한다.
- 관리자 우회가 필요한 곳은 `hasPermission(...)` 또는 별도 공통 헬퍼를 사용한다.

### 전략 B. 공통 헬퍼 확장

- `authHelper` 는 유지하되 아래 보조 함수 도입을 고려한다.
- `assertSelfOrAdmin(targetUserId)`
- `assertOwnerOrAdmin(resourceUserId)`
- `assertAuthorOrAdmin(authorUserId)`
- `resolveTargetUserId(requesterId, targetUserId, isAdmin)`

### 전략 C. 역할 변경 방어

- `POST /api/users`
- 외부 입력 `role` 무시
- 항상 `ROLE_USER` 로 생성
- `PUT /api/users/:id`, `PUT /api/users/me`
- 관리자만 `role` 변경 가능하도록 제한
- 일반 사용자는 자기 정보 수정 시 `role` 입력을 보내도 무시 또는 거부

## 6. API 영향 범위

### Users

- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `PUT /api/users/me`
- `DELETE /api/users/me`

### Campaigns

- `POST /api/campaigns`
- `PUT /api/campaigns/:id`
- `DELETE /api/campaigns/:id`
- `PUT /api/campaigns/:id/status`
- `POST /api/campaigns/:id/members/:userId`
- `DELETE /api/campaigns/:id/members/:userId`
- `POST /api/campaigns/:campaignId/characters/:characterId`
- `DELETE /api/campaigns/:campaignId/characters/:characterId`

### Characters

- `POST /api/characters`
- `PUT /api/characters/:id`
- `DELETE /api/characters/:id`
- `PUT /api/characters/:id/status`
- `POST /api/characters/:id/classes`
- `PUT /api/characters/:id/classes/:className`
- `DELETE /api/characters/:id/classes/:className`

### Sessions

- `POST /api/sessions`
- `PUT /api/sessions/:id`
- `DELETE /api/sessions/:id`
- `POST /api/sessions/:id/players`
- `DELETE /api/sessions/:id/players/:userId`
- `POST /api/sessions/:id/logs`
- `PUT /api/sessions/:id/logs/:logId`
- `DELETE /api/sessions/:id/logs/:logId`

### Currency Transactions

- `POST /api/currency-transactions`
- `PUT /api/currency-transactions/:id`
- `DELETE /api/currency-transactions/:id`

### Log Histories

- 이미 관리자 전용 성격이 강하므로 회귀만 방지하면 된다.

## 7. 세부 설계 포인트

### 7.1 캠페인 멤버 추가/제거

- 현재 path 의 `userId` 와 요청자 ID가 같아야 하는 제약을 관리자 예외로 바꾼다.
- 관리자 요청이면 path 의 `userId` 대상자를 그대로 사용한다.
- 일반 요청이면 기존처럼 자기 자신만 가능하게 유지한다.
- 추가 시 `values.userId` 가 항상 요청자 ID가 아니라 "대상 userId" 를 바라보게 수정한다.
- 제거 시 삭제 조건도 항상 요청자 ID가 아니라 "대상 userId" 를 사용한다.

### 7.2 캐릭터와 캠페인 연결 규칙

- 현재 `POST /api/characters`, `PUT /api/characters/:id` 의 `campaignId` 직접 변경은 일반 사용자 권한을 너무 넓힌다.
- 선택지:
- 1안: 일반 사용자는 `campaignId` 변경 불가, 캠페인 연결은 전용 API에서만 처리
- 2안: 일반 사용자도 자기 캐릭터에 대해 `campaignId` 변경 가능하되 캠페인 멤버십/소유권 검증 강화
- 이번 어드민 확장에서는 1안을 우선 권장한다.
- 즉 일반 사용자의 직접 `campaignId` 변경을 막고, 관리자만 예외적으로 허용하거나 캠페인 전용 API를 사용하게 만든다.

### 7.3 세션 플레이어 등록/제거

- 등록 API는 현재 `character.userId === user.id` 를 직접 비교한다.
- 이 비교를 관리자 예외 포함 로직으로 변경한다.
- 삭제 API는 현재 `targetUserId === user.id` 를 직접 비교한다.
- 관리자 요청이면 대상 `userId` 를 그대로 삭제할 수 있어야 한다.
- 가능하면 path 가 `userId` 기준인지 `characterId` 기준인지도 재검토한다.
- 현재 구조는 한 세션에서 한 유저당 1개 캐릭터만 전제하는 형태라 제약을 문서화해야 한다.

### 7.4 세션 로그 수정/삭제

- 현재 작성자 본인만 가능하다.
- 관리자면 작성자 여부를 무시하고 수정/삭제 가능해야 한다.

### 7.5 사용자 role 변경

- 가장 먼저 막아야 할 위험 지점이다.
- 회원 생성 시 `role` 입력은 무시하고 항상 `ROLE_USER`
- 사용자 수정 시:
- 관리자만 `role` 변경 가능
- 일반 사용자는 `name` 등 자기 정보만 변경 가능

## 8. 구현 순서

1. `users` 계열 role 방어부터 적용
2. 공통 권한 헬퍼 보강
3. 캠페인 멤버 API 정리
4. 캐릭터 `campaignId` 정책 정리
5. 세션 플레이어 API 정리
6. 세션 로그 API 정리
7. 나머지 CUD 엔드포인트 권한 비교식 전수 점검
8. `md/api.md` 문서 갱신

## 9. 검증 계획

### 관리자 시나리오

- 관리자가 다른 유저를 캠페인에 추가 가능
- 관리자가 다른 유저를 캠페인에서 제거 가능
- 관리자가 다른 유저 캐릭터를 캠페인에 등록/해제 가능
- 관리자가 다른 유저 캐릭터를 수정/삭제/상태변경/클래스수정 가능
- 관리자가 다른 유저 캐릭터를 세션 플레이어로 등록/제거 가능
- 관리자가 다른 유저 로그 수정/삭제 가능
- 관리자가 다른 유저 정보 수정/삭제 가능

### 일반 사용자 시나리오

- 일반 사용자는 기존처럼 자기 리소스만 수정 가능
- 일반 사용자는 타인 `userId` path 를 넣어도 실패
- 일반 사용자는 타인 캐릭터/로그/세션플레이어를 수정하거나 제거할 수 없음
- 일반 사용자는 `role` 을 보내도 어드민 승격되지 않음

### 회귀 시나리오

- 기존 관리자 전용 API인 `log-histories`, 거래 수정/삭제가 깨지지 않는지 확인
- 기존 조회 API 응답 구조에 영향 없는지 확인

## 10. 산출물

- 권한 헬퍼 정리
- 전 API CUD 권한 분기 수정
- 사용자 role 변경 방어
- API 문서 업데이트
- 필요 시 권한 정책 문서 추가

## 11. 메모

- 이번 작업의 본질은 "관리자 전용 엔드포인트 추가" 가 아니라 "기존 엔드포인트의 권한 분기 일관화" 다.
- 따라서 라우트 수를 늘리기보다 권한 로직을 한 곳으로 모으는 편이 유지보수에 유리하다.
- 구현 전에 반드시 `campaignId`, `userId`, `characterId` 같은 "대상 식별자" 와 "요청자 식별자" 를 분리해서 보는 기준을 팀 규칙으로 고정해야 한다.
