# API 정리

`src/server/api` 기준 현재 구현된 엔드포인트와, UI 연동에 필요한 최소 스펙만 정리한 문서다.
Swagger 대용이 아니라 "지금 무엇을 호출할 수 있는지" 빠르게 확인하는 기준 문서로 사용한다.

## 1. 공통 규칙

### 인증

- 인증 API는 `X-Discord-ID` 헤더 또는 `discord_id` 쿠키를 사용한다.
- 기준 구현: [auth.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/utils/auth.ts)
- 인증 정보가 없으면 `401 UNAUTHORIZED`
- 식별된 플레이어가 없으면 `404 PLAYER_NOT_FOUND`
- 개발 환경에서는 `ADMIN_DISCORD_ID` 기반 우회가 활성화될 수 있다.

### 공통 응답 형식

기준
구현: [base-response.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/utils/base-response.ts), [response.types.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/types/response.types.ts)

```ts
interface BaseResponseType<TData = null> {
  data: TData;
  error: boolean;
  code: RESPONSE_CODE;
  message: RESPONSE_MESSAGE | string;
}
```

목록형 응답은 `BaseResponse.page()`를 사용한다.

```ts
interface ListDataType<TData> {
  list: TData[];
  totalElements: number;
  filteredElements: number;
  currentPage: number | null;
  pageSize: number | null;
  totalPages: number | null;
  firstPage: number | null;
  lastPage: number | null;
  hasPrev: boolean | null;
  hasNext: boolean | null;
  isFirst: boolean | null;
  isLast: boolean | null;
  isEmpty: boolean | null;
  prevPage: number | null;
  nextPage: number | null;
}
```

### 공통 Query 필드

대부분의 목록 API는 아래 공통 필드를 받는다.

- `id?: number`
- `idList?: number[]`
- `page?: number`
- `size?: number`
- `sort?: string`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- `creatorId?: number`
- `createDate?: string`
- `updaterId?: number`
- `updateDate?: string`
- `deleterId?: number`
- `deleteDate?: string`

별도 지정이 없으면 목록 API는 `deleteYn = 'N'`을 기본 적용한다.

## 2. 프런트 연동 중인 API

현재 UI에서 직접 연결된 확인 대상:

- 플레이어 목록: [useGetPlayerList.ts](/C:/Users/nihil/coding/app/fa-manager/src/app/composables/players/useGetPlayerList.ts)
  - `GET /api/players`
- 내 플레이어 정보: [useGetMyInfo.ts](/C:/Users/nihil/coding/app/fa-manager/src/app/composables/players/useGetMyPlayerInfo.ts)
  - `GET /api/players/me`
- 플레이어 스토어: [player.store.ts](/C:/Users/nihil/coding/app/fa-manager/src/app/stores/player.store.ts)
  - 목록 응답의 `data.list`, `data.totalElements` 사용

UI 연동을 확장할 때도 동일한 `BaseResponseType` / `ListDataType` 구조를 전제로 맞추면 된다.

## 3. 도메인별 엔드포인트

### Health

- `GET /api/health`
  - 설명: 서버 상태 확인
  - 인증: 불필요

### Players

- `GET /api/players`
  - 설명: 플레이어 목록 조회
  - 인증: 불필요
  - Query:
    - 공통 Query
    - `discordId?: string`
    - `name?: string`
    - `role?: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN'`
    - `status?: 'ACTIVE' | 'INACTIVE' | 'REST'`
- `POST /api/players`
  - 설명: 플레이어 생성
  - 인증: 불필요
  - Body:
    - `discordId: string`
    - `name: string`
    - `role?: PlayerRole`
    - `status?: PlayerStatus`
- `GET /api/players/check`
  - 설명: 식별 쿠키/헤더 기반 플레이어 존재 여부 확인
  - 인증: 선택
- `GET /api/players/me`
  - 설명: 현재 로그인 플레이어 조회
  - 인증: 필요
- `PUT /api/players/me`
  - 설명: 현재 로그인 플레이어 수정
  - 인증: 필요
  - Body:
    - `name?: string`
    - `role?: PlayerRole`
    - `status?: PlayerStatus`
- `DELETE /api/players/me`
  - 설명: 현재 로그인 플레이어 삭제 처리
  - 인증: 필요
- `GET /api/players/:id`
  - 설명: 플레이어 단건 조회
  - 인증: 불필요
- `PUT /api/players/:id`
  - 설명: 플레이어 수정
  - 인증: 필요
  - 권한: 본인 또는 관리자
- `DELETE /api/players/:id`
  - 설명: 플레이어 삭제 처리
  - 인증: 필요
  - 권한: 본인 또는 관리자

### Campaigns

- `GET /api/campaigns`
  - Query: 공통 Query + `userId?: number`, `name?: string`, `status?: Status`
- `GET /api/campaigns/mine`
  - 인증: 필요
  - 설명: 현재 플레이어가 생성한 캠페인 목록
- `POST /api/campaigns`
  - 인증: 필요
  - Body:
    - `name: string`
    - `description?: string | null`
    - `status?: Status`
    - `startDate?: string | Date | null`
    - `endDate?: string | Date | null`
- `GET /api/campaigns/:id`
- `PUT /api/campaigns/:id`
  - 인증: 필요
  - 권한: 캠페인 소유자 또는 관리자
- `DELETE /api/campaigns/:id`
  - 인증: 필요
  - 권한: 캠페인 소유자 또는 관리자
- `PUT /api/campaigns/:id/status`
  - 인증: 필요
  - Body: `status: Status`
- `POST /api/campaigns/:id/members/:userId`
  - 인증: 필요
  - 권한: 대상 플레이어 본인 또는 관리자
  - 비고: 중복 참여는 멱등 처리
- `DELETE /api/campaigns/:id/members/:userId`
  - 인증: 필요
  - 권한: 대상 플레이어 본인 또는 관리자
  - 비고: 캠페인 생성자는 이탈 불가
- `POST /api/campaigns/:campaignId/characters/:characterId`
  - 인증: 필요
  - 권한: 캠페인 소유자 또는 관리자
- `DELETE /api/campaigns/:campaignId/characters/:characterId`
  - 인증: 필요
  - 권한: 캠페인 소유자 또는 관리자

### Characters

- `GET /api/characters`
  - Query: 공통 Query + `userId`, `campaignId`, `name`, `status`, `race`, 능력치/전투/저항 계열 필드
- `GET /api/characters/mine`
  - 인증: 필요
  - 설명: 현재 플레이어의 캐릭터 목록
- `POST /api/characters`
  - 인증: 필요
  - Body:
    - `name: string`
    - `race: string`
    - `userId?: number`
    - `campaignId?: number`
    - `status?: CharacterStatus`
    - `startLevel?: number`
    - `startExp?: number`
    - `startCurrencyCp|Sp|Ep|Gp|Pp?: number`
    - 기타 스탯/장비/요구능력치 필드
- `GET /api/characters/:id`
- `PUT /api/characters/:id`
  - 인증: 필요
  - 권한: 소유자 또는 관리자
- `DELETE /api/characters/:id`
  - 인증: 필요
  - 권한: 소유자 또는 관리자
- `PUT /api/characters/:id/status`
  - 인증: 필요
  - Body: `status: CharacterStatus`
- `POST /api/characters/:id/classes`
  - Body: `className: string`, `level?: number`
- `PUT /api/characters/:id/classes/:className`
  - Body: `level?: number`
- `DELETE /api/characters/:id/classes/:className`

### Sessions

- `GET /api/sessions`
  - Query: 공통 Query + `campaignId?: number`, `no?: number`, `name?: string`, `status?: Status | null`
- `GET /api/sessions/mine`
  - 인증: 필요
  - 설명: 현재 플레이어가 소유한 캠페인에 속한 세션 목록
- `POST /api/sessions`
  - 인증: 필요
  - Body:
    - `campaignId: number`
    - `no: number`
    - `name: string`
    - `description?: string | null`
    - `maxPlayer?: number | null`
    - `rewardExp?: number | null`
    - `rewardGold?: number | null`
    - `status?: Status | null`
    - `playDate?: string | Date | null`
- `GET /api/sessions/:id`
- `PUT /api/sessions/:id`
  - 인증: 필요
  - 권한: 캠페인 마스터 또는 관리자
- `DELETE /api/sessions/:id`
  - 인증: 필요
  - 권한: 캠페인 마스터 또는 관리자
- `POST /api/sessions/:id/players`
  - 인증: 필요
  - Body: `characterId: number`
  - 권한: 캐릭터 소유자, 캠페인 마스터 또는 관리자
  - 비고:
    - 캐릭터의 `campaignId`와 세션의 `campaignId`가 같아야 함
    - 중복 등록은 멱등 처리
- `DELETE /api/sessions/:id/players/:userId`
  - 인증: 필요
  - 권한: 대상 플레이어 본인, 캠페인 마스터 또는 관리자

### Session Logs

- `GET /api/sessions/:id/logs`
- `POST /api/sessions/:id/logs`
  - 인증: 필요
  - 권한: 세션 참여자 본인 또는 캠페인 마스터
  - Body: `title: string`, `content?: string | null`, `fileUrl?: string | null`
- `GET /api/sessions/:id/logs/:logId`
- `PUT /api/sessions/:id/logs/:logId`
  - 인증: 필요
  - 권한: 작성자 본인
- `DELETE /api/sessions/:id/logs/:logId`
  - 인증: 필요
  - 권한: 작성자 본인

### Currency Transactions

- `GET /api/currency-transactions`
- `POST /api/currency-transactions`
  - 인증: 필요
  - Body:
    - `characterId: number`
    - `description: string`
    - `transactionType?: TransactionType`
    - `deltaPp|Gp|Ep|Sp|Cp?: number`
- `GET /api/currency-transactions/:id`
- `PUT /api/currency-transactions/:id`
  - 인증: 필요
  - 권한: 소유자 또는 관리자
- `DELETE /api/currency-transactions/:id`
  - 인증: 필요
  - 권한: 소유자 또는 관리자

### Log Histories

- `GET /api/log-histories`
- `POST /api/log-histories`
- `GET /api/log-histories/:id`
- `PUT /api/log-histories/:id`
- `DELETE /api/log-histories/:id`
  - 공통 규칙: 모두 인증 필요, 관리자 전용

### Icons

- `GET /api/icons`
  - 설명: 아이콘 메타/리소스 조회용 엔드포인트

## 4. 현재 연동 우선순위

API와 UI를 붙일 때 우선 순위는 아래 기준이 현실적이다.

1. 플레이어
  - 목록, 내 정보, 수정
2. 캠페인
  - 목록, 내 캠페인, 생성/수정/상태변경
3. 세션
  - 목록, 상세, 세션 플레이어 등록/제거
4. 캐릭터
  - 목록, 내 캐릭터, 생성/수정

## 5. 주의 사항

- 일부 응답 메시지는 최근 정리되어 권한 실패 문구가 더 구체적으로 나간다.
- `docs` API는 현재 `src/server/api`에 구현되어 있지 않다.
- `api.template.ts`는 실제 엔드포인트가 아니라 템플릿이다.
