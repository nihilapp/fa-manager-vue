# API 정리

현재 `src/server/api` 기준으로 구현되어 있는 엔드포인트만 정리했다.
이 문서는 Swagger 대용으로 "이 API가 어떤 데이터를 받을 수 있는지" 빠르게 확인하는 용도다.

## 공통 규칙

### 인증

- 인증이 필요한 API는 요청 헤더 `X-Discord-ID` 가 필요하다.
- 인증은 [auth.ts](/C:/Users/nihil/coding/app/fa-manager/src/server/utils/auth.ts) 기준이다.
- `X-Discord-ID` 가 없으면 `401`
- 해당 `discordId` 유저가 없으면 `404`

### 공통 Query 필드

목록 조회 API 대부분은 아래 공통 query를 받을 수 있다.

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

기본적으로 목록 API는 `deleteYn` 을 전달하지 않으면 내부에서 `N` 으로 처리한다.

## Health

### `GET /api/health`

- 설명: 서버 생존 확인
- 인증: 불필요
- 입력 데이터: 없음

## Users

### `GET /api/users`

- 설명: 유저 목록 조회
- 인증: 불필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `discordId?: string`
- `name?: string`
- `role?: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN'`

### `POST /api/users`

- 설명: 유저 생성
- 인증: 불필요
- Body:
- `discordId: string` 필수
- `name: string` 필수
- `role?: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN'` (무시됨, 항상 `ROLE_USER`로 생성)
- `creatorId?: number`

### `GET /api/users/:id`

- 설명: 유저 단건 조회
- 인증: 불필요
- Path:
- `id: number` 필수

### `PUT /api/users/:id`

- 설명: 유저 수정
- 인증: 필요
- 권한: 본인 또는 관리자
- Path:
- `id: number` 필수
- Body:
- `name?: string`
- `role?: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN'` (관리자만 수정 가능)
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- `updaterId?: number`
- 비고: 일반 사용자가 `role`을 보내면 기존 값이 유지된다.

### `DELETE /api/users/:id`

- 설명: 유저 삭제 처리
- 인증: 필요
- 권한: 본인 또는 관리자
- Path:
- `id: number` 필수
- Body: 없음

### `PUT /api/users/me`

- 설명: 로그인한 본인 유저 정보 수정
- 인증: 필요
- Body:
- `name?: string`
- `role?: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN'`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- `updaterId?: number`
- 비고:
- path의 `id` 없이 인증된 사용자 본인 레코드를 직접 수정한다.
- body 객체 자체는 필요하지만, 특정 필드를 필수로 강제하지는 않는다.

### `DELETE /api/users/me`

- 설명: 로그인한 본인 유저 탈퇴 처리
- 인증: 필요
- Body: 없음
- 비고:
- 인증된 사용자 본인 레코드만 삭제 처리한다.

## Campaigns

### `GET /api/campaigns`

- 설명: 캠페인 목록 조회
- 인증: 불필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `userId?: number`
- `name?: string`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD'`

### `GET /api/campaigns/mine`

- 설명: 로그인한 사용자가 생성한 캠페인 목록 조회
- 인증: 필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `name?: string`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD'`
- 비고:
- 내부적으로 `userId` 는 인증 사용자 ID로 고정된다.
- 응답에는 `user` 관계가 포함된다.

### `POST /api/campaigns`

- 설명: 캠페인 생성
- 인증: 필요
- Body:
- `name: string` 필수
- `startDate?: string | Date | null`
- `description?: string | null`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD'`
- `endDate?: string | Date | null`
- 비고: `userId` 는 body로 받지 않고 인증 사용자로 고정된다.
- 비고: `startDate` 는 선택값이라 생략 가능하며, 전달하지 않으면 `null` 로 저장된다.

### `GET /api/campaigns/:id`

- 설명: 캠페인 단건 조회
- 인증: 불필요
- Path:
- `id: number` 필수

### `PUT /api/campaigns/:id`

- 설명: 캠페인 수정
- 인증: 필요
- Path:
- `id: number` 필수
- Body:
- `name?: string`
- `description?: string | null`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD'`
- `startDate?: string | Date | null`
- `endDate?: string | Date | null`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- 비고: `startDate` 는 선택값이며, 필드를 생략하면 기존 값을 유지하고 `null` 을 보내면 시작일을 제거한다.

### `DELETE /api/campaigns/:id`

- 설명: 캠페인 삭제 처리
- 인증: 필요
- Path:
- `id: number` 필수
- Body: 없음

### `PUT /api/campaigns/:id/status`

- 설명: 캠페인 상태만 수정
- 인증: 필요
- Path:
- `id: number` 필수
- Body:
- `status: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD'` 필수

### `POST /api/campaigns/:id/members/:userId`

- 설명: 캠페인 참여
- 인증: 필요
- 권한: 본인 또는 관리자
- Path:
- `id: number` 필수
- `userId: number` 필수
- Body:
- 없음
- 비고:
- 일반 사용자는 `userId`와 인증 사용자 ID가 같아야 한다.
- 관리자는 타인을 캠페인에 가입시킬 수 있다.
- 중복 참여는 멱등 처리된다.

### `DELETE /api/campaigns/:id/members/:userId`

- 설명: 캠페인 이탈
- 인증: 필요
- 권한: 본인 또는 관리자
- Path:
- `id: number` 필수
- `userId: number` 필수
- Body: 없음
- 비고:
- 일반 사용자는 `userId`와 인증 사용자 ID가 같아야 한다.
- 관리자는 타인을 캠페인에서 강퇴할 수 있다.
- 캠페인 생성자(소유자)는 이탈할 수 없다.


### `POST /api/campaigns/:campaignId/characters/:characterId`

- 설명: 캐릭터를 캠페인에 연결
- 인증: 필요
- Path:
- `campaignId: number` 필수
- `characterId: number` 필수
- Body: 없음

### `DELETE /api/campaigns/:campaignId/characters/:characterId`

- 설명: 캐릭터의 캠페인 연결 해제
- 인증: 필요
- Path:
- `campaignId: number` 필수
- `characterId: number` 필수
- Body: 없음

## Characters

### `GET /api/characters`

- 설명: 캐릭터 목록 조회
- 인증: 불필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `userId?: number`
- `campaignId?: number`
- `name?: string`
- `status?: 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED'`
- `race?: string`
- `currentLevel?: number`
- `str?: number`
- `dex?: number`
- `con?: number`
- `int?: number`
- `wis?: number`
- `cha?: number`
- `ac?: number`
- `hp?: number`
- `speed?: string`
- `vision?: string`
- `skills?: string`
- `advantage?: string`
- `disadvantage?: string`
- `resistance?: string`
- `immunity?: string`

### `GET /api/characters/mine`

- 설명: 로그인한 사용자의 캐릭터 목록 조회
- 인증: 필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `campaignId?: number`
- `name?: string`
- `status?: 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED'`
- `race?: string`
- `currentLevel?: number`
- `str?: number`
- `dex?: number`
- `con?: number`
- `int?: number`
- `wis?: number`
- `cha?: number`
- `ac?: number`
- `hp?: number`
- `speed?: string`
- `vision?: string`
- `skills?: string`
- `advantage?: string`
- `disadvantage?: string`
- `resistance?: string`
- `immunity?: string`
- 비고:
- 내부적으로 `userId` 는 인증 사용자 ID로 고정된다.
- 응답에서 `currentLevel`, `currentExp`, `currentCurrency*` 는 계산값이다.

### `POST /api/characters`

- 설명: 캐릭터 생성
- 인증: 필요
- 권한: 본인 또는 관리자
- Body:
- `name: string` 필수
- `race: string` 필수
- `userId?: number` (관리자 전용, 미지정 시 본인 ID)
- `campaignId?: number` (관리자 전용, 일반 사용자는 무시됨)
- `status?: 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED'`
- `startLevel?: number`
- `startExp?: number`
- `str?: number`
- `dex?: number`
- `con?: number`
- `int?: number`
- `wis?: number`
- `cha?: number`
- `ac?: number`
- `hp?: number`
- `speed?: string`
- `vision?: string`
- `skills?: string`
- `advantage?: string`
- `disadvantage?: string`
- `resistance?: string`
- `immunity?: string`
- `startCurrencyCp?: number`
- `startCurrencySp?: number`
- `startCurrencyEp?: number`
- `startCurrencyGp?: number`
- `startCurrencyPp?: number`
- `mainHand?: string`
- `offHand?: string`
- `armor?: string`
- `head?: string`
- `gauntlet?: string`
- `boots?: string`
- `belt?: string`
- `cloak?: string`
- `accessory1?: string`
- `accessory2?: string`
- `accessory3?: string`
- `accessory4?: string`
- `reqStrDex8?: string`
- `reqStrDex10?: string`
- `reqStrDex12?: string`
- `reqStrDex14?: string`
- `reqStr16?: string`
- `reqStr18?: string`
- `reqStr20?: string`
- `reqCon8?: string`
- `reqCon10?: string`
- `reqCon12?: string`
- `reqCon14?: string`
- `reqCon16?: string`
- `reqCon18?: string`
- `reqCon20?: string`
- 비고:
- 일반 사용자는 `campaignId`를 직접 설정할 수 없으며, 생성 후 캠페인 연결 API를 사용해야 함.
- 관리자는 타인(`userId`)의 캐릭터를 특정 캠페인(`campaignId`)에 즉시 생성해 줄 수 있음.

### `GET /api/characters/:id`

- 설명: 캐릭터 단건 조회
- 인증: 불필요
- Path:
- `id: number` 필수

### `PUT /api/characters/:id`

- 설명: 캐릭터 수정
- 인증: 필요
- 권한: 소유자 또는 관리자
- Path:
- `id: number` 필수
- Body:
- `name?: string`
- `campaignId?: number | null` (관리자만 수정 가능)
- `status?: 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED'`
- `race?: string`
- `startLevel?: number`
- `startExp?: number`
- `str?: number | null`
- `dex?: number | null`
- `con?: number | null`
- `int?: number | null`
- `wis?: number | null`
- `cha?: number | null`
- `ac?: number | null`
- `hp?: number | null`
- `speed?: string | null`
- `vision?: string | null`
- `skills?: string | null`
- `advantage?: string | null`
- `disadvantage?: string | null`
- `resistance?: string | null`
- `immunity?: string | null`
- `mainHand?: string | null`
- `offHand?: string | null`
- `armor?: string | null`
- `head?: string | null`
- `gauntlet?: string | null`
- `boots?: string | null`
- `belt?: string | null`
- `cloak?: string | null`
- `accessory1?: string | null`
- `accessory2?: string | null`
- `accessory3?: string | null`
- `accessory4?: string | null`
- `reqStrDex8?: string | null`
- `reqStrDex10?: string | null`
- `reqStrDex12?: string | null`
- `reqStrDex14?: string | null`
- `reqStr16?: string | null`
- `reqStr18?: string | null`
- `reqStr20?: string | null`
- `reqCon8?: string | null`
- `reqCon10?: string | null`
- `reqCon12?: string | null`
- `reqCon14?: string | null`
- `reqCon16?: string | null`
- `reqCon18?: string | null`
- `reqCon20?: string | null`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- 비고: 일반 사용자가 `campaignId`를 수정하려고 하면 기존 값이 유지됨.

### `DELETE /api/characters/:id`

- 설명: 캐릭터 삭제 처리
- 인증: 필요
- Path:
- `id: number` 필수
- Body: 없음

### `PUT /api/characters/:id/status`

- 설명: 캐릭터 상태만 수정
- 인증: 필요
- Path:
- `id: number` 필수
- Body:
- `status: 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED'` 필수

### `POST /api/characters/:id/classes`

- 설명: 캐릭터 클래스 추가
- 인증: 필요
- Path:
- `id: number` 필수
- Body:
- `className: string` 필수
- `level?: number`

### `PUT /api/characters/:id/classes/:className`

- 설명: 캐릭터 클래스 수정
- 인증: 필요
- Path:
- `id: number` 필수
- `className: string` 필수
- Body:
- `level?: number`

### `DELETE /api/characters/:id/classes/:className`

- 설명: 캐릭터 클래스 삭제
- 인증: 필요
- Path:
- `id: number` 필수
- `className: string` 필수
- Body: 없음

## Sessions

### `GET /api/sessions`

- 설명: 세션 목록 조회
- 인증: 불필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `campaignId?: number`
- `no?: number`
- `name?: string`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD' | null`

### `GET /api/sessions/mine`

- 설명: 로그인한 사용자가 소유한 캠페인들의 세션 목록 조회
- 인증: 필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `campaignId?: number`
- `no?: number`
- `name?: string`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD' | null`
- 비고:
- 내가 참여 중인 세션 목록이 아니라, 내가 생성한 캠페인에 속한 세션 목록이다.
- 응답에는 `campaign`, `players.user`, `players.character` 관계가 포함된다.

### `POST /api/sessions`

- 설명: 세션 생성
- 인증: 필요
- Body:
- `campaignId: number` 필수
- `no: number` 필수
- `name: string` 필수
- `description?: string | null`
- `maxPlayer?: number | null`
- `rewardExp?: number | null`
- `rewardGold?: number | null`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD' | null`
- `playDate?: string | Date | null`

### `GET /api/sessions/:id`

- 설명: 세션 단건 조회
- 인증: 불필요
- Path:
- `id: number` 필수

### `PUT /api/sessions/:id`

- 설명: 세션 수정
- 인증: 필요
- Path:
- `id: number` 필수
- Body:
- `no?: number`
- `name?: string`
- `description?: string | null`
- `maxPlayer?: number | null`
- `rewardExp?: number | null`
- `rewardGold?: number | null`
- `status?: 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD' | null`
- `playDate?: string | Date | null`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`

### `DELETE /api/sessions/:id`

- 설명: 세션 삭제 처리
- 인증: 필요
- Path:
- `id: number` 필수
- Body: 없음

### `POST /api/sessions/:id/players`

- 설명: 세션 참여
- 인증: 필요
- 권한: 캐릭터 소유자, 캠페인 마스터 또는 관리자
- Path:
- `id: number` 필수
- Body:
- `characterId: number` 필수
- 비고:
- 캐릭터의 `campaignId`와 세션의 `campaignId`가 같아야 함
- 관리자나 캠페인 마스터는 타인의 캐릭터를 세션에 등록할 수 있음
- 중복 참여는 멱등 처리

### `DELETE /api/sessions/:id/players/:userId`

- 설명: 세션 이탈
- 인증: 필요
- 권한: 본인, 캠페인 마스터 또는 관리자
- Path:
- `id: number` 필수
- `userId: number` 필수
- Body: 없음
- 비고:
- 관리자나 캠페인 마스터는 타인을 세션에서 제외할 수 있음

## Session Logs

### `GET /api/sessions/:id/logs`

- 설명: 특정 세션의 로그 목록 조회
- 인증: 불필요
- Path:
- `id: number` 필수
- Query:
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
- `sessionId?: number`
- `userId?: number`
- `title?: string`
- 비고: 실제 라우트는 path의 `:id` 세션 범위로 고정되므로 `sessionId` query를 따로 줄 필요는 없다.

### `POST /api/sessions/:id/logs`

- 설명: 특정 세션의 로그 생성
- 인증: 필요
- Path:
- `id: number` 필수
- Body:
- `title: string` 필수
- `content?: string | null`
- `fileUrl?: string | null`
- `sessionId?: number`
- 비고:
- DTO에는 `sessionId` 가 있지만 실제 저장은 path의 `:id` 값을 사용한다.
- 세션 참여자 본인 또는 캠페인 마스터만 생성 가능

### `GET /api/sessions/:id/logs/:logId`

- 설명: 특정 세션 로그 단건 조회
- 인증: 불필요
- Path:
- `id: number` 필수
- `logId: number` 필수

### `PUT /api/sessions/:id/logs/:logId`

- 설명: 특정 세션 로그 수정
- 인증: 필요
- Path:
- `id: number` 필수
- `logId: number` 필수
- Body:
- `title?: string`
- `content?: string | null`
- `fileUrl?: string | null`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- 비고: 작성자 본인만 수정 가능

### `DELETE /api/sessions/:id/logs/:logId`

- 설명: 특정 세션 로그 삭제 처리
- 인증: 필요
- Path:
- `id: number` 필수
- `logId: number` 필수
- Body: 없음
- 비고: 작성자 본인만 삭제 가능

## Currency Transactions

### `GET /api/currency-transactions`

- 설명: 화폐 거래 목록 조회
- 인증: 불필요
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `creatorId?: number`
- `createDate?: string`
- `updaterId?: number`
- `updateDate?: string`
- `deleterId?: number`
- `deleteDate?: string`
- `userId?: number`
- `characterId?: number`
- `transactionType?: 'REWARD' | 'INCOME' | 'EXPENSE' | 'EXCHANGE' | 'INIT'`
- `description?: string`

### `POST /api/currency-transactions`

- 설명: 화폐 거래 생성
- 인증: 필요
- Body:
- `characterId: number` 필수
- `description: string` 필수
- `transactionType?: 'REWARD' | 'INCOME' | 'EXPENSE' | 'EXCHANGE' | 'INIT'`
- `deltaPp?: number`
- `deltaGp?: number`
- `deltaEp?: number`
- `deltaSp?: number`
- `deltaCp?: number`
- 비고:
- `transactionType` 기본값은 `INIT`
- `INIT` 거래는 캐릭터당 1건만 허용
- 캐릭터 소유자 본인 또는 관리자만 생성 가능

### `GET /api/currency-transactions/:id`

- 설명: 화폐 거래 단건 조회
- 인증: 불필요
- Path:
- `id: number` 필수

### `PUT /api/currency-transactions/:id`

- 설명: 화폐 거래 수정
- 인증: 필요
- 권한: 소유자 또는 관리자
- Path:
- `id: number` 필수
- Body:
- `transactionType?: 'REWARD' | 'INCOME' | 'EXPENSE' | 'EXCHANGE' | 'INIT'`
- `description?: string`
- `deltaPp?: number`
- `deltaGp?: number`
- `deltaEp?: number`
- `deltaSp?: number`
- `deltaCp?: number`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- 비고:
- 본인(거래의 userId) 또는 관리자만 수정 가능
- body 객체는 필요하지만 특정 필드를 필수로 강제하지는 않는다.
- 다른 거래를 `INIT` 로 바꾸는 경우, 같은 캐릭터의 기존 `INIT` 거래와 충돌하면 실패한다.

### `DELETE /api/currency-transactions/:id`

- 설명: 화폐 거래 삭제 처리
- 인증: 필요
- 권한: 소유자 또는 관리자
- Path:
- `id: number` 필수
- Body: 없음
- 비고: 본인(거래의 userId) 또는 관리자만 삭제 가능

## Log Histories

### `GET /api/log-histories`

- 설명: 시스템 로그 이력 목록 조회
- 인증: 필요
- 권한: 관리자만 가능
- Query:
- `id`, `idList`, `page`, `size`, `sort`, `useYn`, `deleteYn`
- `creatorId?: number`
- `createDate?: string`
- `updaterId?: number`
- `updateDate?: string`
- `deleterId?: number`
- `deleteDate?: string`
- `userId?: number`
- `tableName?: string`
- `targetId?: number`
- `actionType?: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE'`
- `description?: string`

### `POST /api/log-histories`

- 설명: 시스템 로그 이력 생성
- 인증: 필요
- 권한: 관리자만 가능
- Body:
- `userId: number` 필수
- `tableName: string` 필수
- `targetId: number` 필수
- `actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE'` 필수
- `oldData?: any`
- `newData?: any`
- `description?: string | null`
- 비고:
- `oldData`, `newData` 는 `jsonb` 컬럼에 저장된다.

### `GET /api/log-histories/:id`

- 설명: 시스템 로그 이력 단건 조회
- 인증: 필요
- 권한: 관리자만 가능
- Path:
- `id: number` 필수

### `PUT /api/log-histories/:id`

- 설명: 시스템 로그 이력 수정
- 인증: 필요
- 권한: 관리자만 가능
- Path:
- `id: number` 필수
- Body:
- `tableName?: string`
- `targetId?: number`
- `actionType?: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE'`
- `oldData?: any`
- `newData?: any`
- `description?: string | null`
- `useYn?: 'Y' | 'N'`
- `deleteYn?: 'Y' | 'N'`
- 비고:
- `oldData`, `newData` 는 `jsonb` 컬럼에 저장된다.
- `description`, `oldData`, `newData` 는 `null` 로 갱신할 수 있다.

### `DELETE /api/log-histories/:id`

- 설명: 시스템 로그 이력 삭제 처리
- 인증: 필요
- 권한: 관리자만 가능
- Path:
- `id: number` 필수
- Body: 없음

## 문서에서 제외한 것

- `docs` API는 현재 `src/server/api` 에 구현되어 있지 않아 제외했다.
- `src/server/api/api.template.ts` 는 템플릿 파일이라 제외했다.
