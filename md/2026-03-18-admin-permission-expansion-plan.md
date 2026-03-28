# Admin Permission Expansion Plan

이 문서는 최초 계획 문서였고, 현재는 "현행 권한 정책 요약 + 남은 과제" 문서로 갱신한다.

## 1. 현재 적용된 기준

기준 구현: [auth.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/utils/auth.ts)

- 요청자는 `X-Discord-ID` 또는 `discord_id` 쿠키로 식별한다.
- `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`는 관리자 권한으로 처리된다.
- `hasPermission(resourcePlayerId)`는 아래 의미를 가진다.
  - 일반 플레이어: 자신의 리소스만 허용
  - 관리자: 모든 리소스 허용

## 2. 현재 명칭 기준

예전 `users` 문맥은 현재 `players`로 전환되었다.

- `/api/users` -> `/api/players`
- `User*Dto` -> `Player*Dto`
- `usersTable` -> `playersTable`

이 문서의 권한 해석도 모두 `player` 기준으로 본다.

## 3. 현재 정책 요약

### Players

- `PUT /api/players/:id`
  - 본인 또는 관리자
- `DELETE /api/players/:id`
  - 본인 또는 관리자
- `PUT /api/players/me`
  - 인증된 본인
- `DELETE /api/players/me`
  - 인증된 본인

### Campaigns

- `POST /api/campaigns`
  - 인증 필요
- `PUT /api/campaigns/:id`
  - 캠페인 소유자 또는 관리자
- `DELETE /api/campaigns/:id`
  - 캠페인 소유자 또는 관리자
- `PUT /api/campaigns/:id/status`
  - 캠페인 소유자 또는 관리자
- `POST /api/campaigns/:id/members/:userId`
  - 대상 플레이어 본인 또는 관리자
- `DELETE /api/campaigns/:id/members/:userId`
  - 대상 플레이어 본인 또는 관리자
  - 캠페인 생성자는 이탈 불가
- `POST|DELETE /api/campaigns/:campaignId/characters/:characterId`
  - 캠페인 소유자 또는 관리자

### Characters

- 생성/수정/삭제/상태 변경/클래스 관리
  - 기본적으로 소유자 또는 관리자

### Sessions

- 세션 생성/수정/삭제
  - 캠페인 마스터 또는 관리자
- 세션 플레이어 등록
  - 캐릭터 소유자, 캠페인 마스터 또는 관리자
- 세션 플레이어 제거
  - 대상 플레이어 본인, 캠페인 마스터 또는 관리자
- 세션 로그 생성
  - 세션 참여자 본인 또는 캠페인 마스터
- 세션 로그 수정/삭제
  - 작성자 본인

### Currency Transactions

- 생성/수정/삭제
  - 소유자 또는 관리자

### Log Histories

- 전 API 관리자 전용

## 4. 최근 반영된 정리

- 캠페인 권한 실패 메시지가 플레이어 권한 메시지와 분리되었다.
- 세션 플레이어 등록 시 "캠페인 불일치"가 별도 메시지로 분리되었다.
- 플레이어 수정/삭제는 전용 금지 메시지를 사용한다.

## 5. 아직 남은 검토 과제

현재 코드 기준으로 남아 있는 검토 포인트는 아래다.

1. 세션 로그 수정/삭제에 관리자 우회가 필요한지 정책 재확정
2. 플레이어 생성 시 `role` 입력 허용 범위를 더 강하게 제한할지 검토
3. `docs` API가 생기면 권한 정책을 플레이어/관리자 기준으로 새로 정의

## 6. API/UI 연동 전에 볼 것

- 프런트는 401에서 `/block`으로 이동한다.
  - 기준 구현: [api-error-handler.ts](/C:/Users/nihil/coding/app/fa-manager/src/app/utils/api-error-handler.ts)
- 따라서 UI는 권한 실패 메시지보다 `code` 분기와 인증 상태 처리를 먼저 맞추는 편이 안전하다.
