# FA Manager API Specification

> **버전:** 1.0.0
> **설명:** FA Manager 백엔드 REST API 명세서입니다. 본 문서는 프론트엔드 연동 및 외부 개발자를 위한 Swagger 형식의 상세 API 가이드 역할을 수행합니다.

## 📌 1. 공통 사항 (Global Info)

### Base URL
```
http://{HOST}:{PORT}/api
```

### 공통 헤더 (Headers)
| Header Name | Type | Required | Description |
| :--- | :---: | :---: | :--- |
| `Content-Type` | `string` | **Yes** *(POST, PATCH 시)* | `application/json` |
| `X-Discord-ID` | `string` | **Yes** | 현재 요청을 발생시킨 사용자의 고유 Discord 식별자. 인증 및 권한 확인용으로 반드시 포함되어야 합니다. |

### 공통 쿼리 파라미터 : Pagination & Sorting
목록 조회(`GET` List) 엔드포인트에서 공통으로 지원하는 파라미터입니다.

| Query Parameter | Type | Required | Default | Description |
| :--- | :---: | :---: | :---: | :--- |
| `page` | `number` | No | `0` | 페이지 번호 (0부터 시작) |
| `size` | `number` | No | `10` | 페이지 당 표출할 레코드 개수 |
| `sort` | `string` | No | `createdDate:desc` | 정렬 조건. 쉼표(`,`)로 다중 정렬 가능. <br>*형식:* `columnName:asc` 또는 `columnName:desc` <br>*예시:* `sort=name:asc,createdDate:desc` |

---

## 👥 2. Users (사용자)
사용자의 정보, 가입, 역할을 관리합니다.

### 💡 필수 요소 (UI 표출 시 권장 데이터)
> `createdDate`, `updaterId`, `useYn` 등의 메타데이터를 제외하고 UI에서 필수적으로 소비해야 할 핵심 컬럼들입니다.
- **`id`** (Number): 사용자 고유 식별자 (PK)
- **`name`** (String): 표시될 닉네임
- **`discordId`** (String): 디스코드 연동 ID (아바타/프로필 연동 시 사용)

### 2.1 사용자 계정 등록 및 복구
- **Endpoint**: `POST /api/users`
- **Description**: 신규 사용자를 등록합니다. 만약 Soft Delete(`deleteYn='Y'`) 상태인 사용자가 재요청 시 계정을 복구합니다.

**Request Body** (`UserInDto`)
```json
{
  "name": "홍길동",
  "discordId": "197054124020334593",
  "role": "PLAYER"
}
```
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `name` | `string` | No | 표시될 사용자 닉네임 |
| `discordId` | `string` | No | 디스코드 고유 ID |
| `role` | `string` | No | 시스템 권한 (ex. `ADMIN`, `PLAYER` 등) |

**Response (200 OK)** - `UserOutDto`
```json
{
  "id": 1,
  "name": "홍길동",
  "discordId": "197054124020334593",
  "useYn": "Y",
  "deleteYn": "N",
  "createdDate": "2026-03-03T10:00:00Z"
}
```

### 2.2 사용자 목록 조회
- **Endpoint**: `GET /api/users`
- **Description**: 등록된 사용자의 목록을 페이징하여 조회합니다.

**Query Parameters**
| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `name` | `string` | No | 이름 기반 검색 필터 |
| *(공통 파라미터 적용)* | | | `page`, `size`, `sort` 사용 가능 |

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "name": "홍길동",
    "discordId": "197054124020334593",
    "useYn": "Y"
  },
  {
    "id": 2,
    "name": "테스터",
    "discordId": "55554124020334111",
    "useYn": "Y"
  }
]
```

### 2.3 사용자 상세 조회
- **Endpoint**: `GET /api/users/{id}`
- **Description**: 특정 ID 기반의 사용자 상세 정보를 조회합니다. 캠페인이나 캐릭터 등의 연관 데이터가 포함될 수 일습니다.

**Path Parameters**
- `id` (`number`, **Required**): 사용자 식별자 (PK)

**Response (200 OK)** - `UserOutDto`
```json
{
  "id": 1,
  "name": "홍길동",
  "discordId": "197054124020334593",
  "createdDate": "2026-03-03T10:00:00Z",
  "characters": [
    {
      "id": 1,
      "name": "검사",
      "level": 3
    }
  ]
}
```

### 2.4 사용자 정보 수정
- **Endpoint**: `PATCH /api/users/{id}`
- **Description**: 기존 사용자의 정보를 일부 수정합니다. 상태 변경(사용 중지 등)에도 쓰입니다.

**Path Parameters**
- `id` (`number`, **Required**): 사용자 식별자

**Request Body** (`Partial<UserInDto>`)
```json
{
  "name": "수정된 닉네임",
  "useYn": "N"
}
```

**Response (200 OK)**
```json
{
  "id": 1,
  "name": "수정된 닉네임",
  "useYn": "N"
}
```

### 2.5 사용자 삭제 (Soft Delete)
- **Endpoint**: `DELETE /api/users/{id}`
- **Description**: 사용자를 비활성화(`deleteYn = 'Y'`) 처리합니다. 실제 DB 레코드를 날리지 않습니다.

**Path Parameters**
- `id` (`number`, **Required**): 사용자 식별자

**Response (200 OK or 204 No Content)**
```json
{
  "success": true,
  "message": "삭제 완료"
}
```

---

## 🗺️ 3. Campaigns (캠페인)
TRPG 캠페인 방 자체를 관리합니다.

### 💡 필수 요소 (UI 표출 시 권장 데이터)
> 캠페인 성격상 목록이나 상세 정보에 노출해야 할 코어 정보들입니다.
- **`id`** (Number): 캠페인 고유 식별자 (라우팅 시 사용)
- **`name`** (String): 캠페인 타이틀
- **`startDate`** (String): 시작 일자
- **`endDate`** (String): 종료 (예정) 일자

### 3.1 캠페인 생성
- **Endpoint**: `POST /api/campaigns`

**Request Body** (`CampaignInDto`)
```json
{
  "name": "저주받은 성 탐험",
  "startDate": "2026-04-01",
  "endDate": "2026-10-31"
}
```
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `name` | `string` | No | 캠페인 타이틀 |
| `startDate` | `string(date-time)` | No | 캠페인 개시일 |
| `endDate` | `string(date-time)` | No | 종료 예정일 |

**Response (200 OK)** - `CampaignOutDto`
```json
{
  "id": 1,
  "name": "저주받은 성 탐험",
  "startDate": "2026-04-01",
  "endDate": "2026-10-31",
  "createdDate": "2026-03-03T10:00:00Z"
}
```

### 3.2 캠페인 목록 조회
- **Endpoint**: `GET /api/campaigns`
- **Query Parameters**: 공통 파라미터 (`page`, `size`, `sort`)

**Response (200 OK)**
```json
[
  {
    "id": 1,
    "name": "저주받은 성 탐험",
    "startDate": "2026-04-01"
  }
]
```

### 3.3 캠페인 상세 조회
- **Endpoint**: `GET /api/campaigns/{id}`

**Response (200 OK)**
```json
{
  "id": 1,
  "name": "저주받은 성 탐험",
  "startDate": "2026-04-01",
  "members": [
    { "userId": 1, "role": "MASTER" },
    { "userId": 2, "role": "PLAYER" }
  ]
}
```

### 3.4 캠페인 수정 & 삭제
- **수정**: `PATCH /api/campaigns/{id}` (Body에 수정 필드 전달)
- **삭제**: `DELETE /api/campaigns/{id}` (Soft Delete)

---

## 🛡️ 4. Characters (캐릭터)
명확한 캠페인에 종속되거나 특정 사용자가 소유하는 플레이어 캐릭터 정보입니다.

### 💡 필수 요소 (UI 표출 시 권장 데이터)
> 캐릭터 시트/대시보드 구성 시 반드시 노출되어야 할 핵심 데이터입니다.
- **`id`** (Number): 캐릭터 고유 식별자
- **`campaignId`** (Number): 소속 캠페인 ID
- **`userId`** (Number): 소유자(유저) ID
- **`name`** (String): 캐릭터 명칭
- **`level`** (Number): 현재 레벨
- **`exp`** (Number): 누적/보유 경험치
- **`currency`** (Number): 보유 재화(소지금)
- **`classes`** (Array): 직업 및 서브클래스 정보 (`[{ class, subclass }]`)

### 4.1 캐릭터 생성
- **Endpoint**: `POST /api/characters`

**Request Body** (`CharacterInDto`)
```json
{
  "campaignId": 1,
  "userId": 1,
  "name": "전사 바보",
  "level": 1,
  "classes": [
    { "class": "Fighter", "subclass": "Champion" }
  ]
}
```

**Response (200 OK)** - `CharacterOutDto`
```json
{
  "id": 1,
  "campaignId": 1,
  "userId": 1,
  "name": "전사 바보",
  "level": 1,
  "exp": 0,
  "currency": 0,
  "classes": [
    { "class": "Fighter", "subclass": "Champion" }
  ]
}
```

### 4.2 캐릭터 목록 조회 & 상세 조회
- **목록**: `GET /api/characters?campaignId=1` (캠페인별 쿼리 가능)
- **상세**: `GET /api/characters/{id}`

### 4.3 캐릭터 상태 수정 & 삭제
- **수정**: `PATCH /api/characters/{id}`
  - *예시 용도:* 레벨업, 경험치/돈 직접 변경 적용 시.
  ```json
  { "level": 2, "exp": 100 }
  ```
- **삭제**: `DELETE /api/characters/{id}`

---

## 🎲 5. Sessions (세션 / 플레이 회차)
하나의 캠페인 내에서 벌어지는 개별 플레이 회차 정보입니다.

### 💡 필수 요소 (UI 표출 시 권장 데이터)
> 세션 목록 및 상세 내역에 요약 표출할 필수 정보입니다.
- **`id`** (Number): 세션 식별자
- **`campaignId`** (Number): 소속 캠페인 ID
- **`title`** (String): 세션 부제 / 플레이 일지 제목
- **`masterId`** (Number): 해당 세션을 진행한 마스터의 User ID
- **`playDate`** (String): 실제 플레이를 진행한/예정된 날짜
- **`expReward`** (Number): 세션 기본 보상 경험치 (참여 캐릭터가 얻음)
- **`goldReward`** (Number): 세션 기본 보상 재화

### 5.1 세션 생성
- **Endpoint**: `POST /api/sessions`

**Request Body** (`SessionInDto`)
```json
{
  "campaignId": 1,
  "title": "에피소드 1: 고블린 동굴",
  "masterId": 1,
  "playDate": "2026-04-01",
  "expReward": 50,
  "goldReward": 15
}
```

### 5.2 세션 목록 및 상세 조회
- **목록**: `GET /api/sessions?campaignId=1`
- **상세**: `GET /api/sessions/{id}`

---

## 📜 6. Data Logs (경험치 & 재화 로그)
캐릭터들의 재화와 경험치 증감을 추적하는 감사 로그입니다. (ExpLog / CurrencyLog 구조 동일)

### 💡 필수 요소 (UI 표출 시 권장 데이터)
> 로그 및 히스토리를 렌더링하기 위해 필요한 필수 칼럼입니다.
- **`id`** (Number): 로그 식별자
- **`characterId`** (Number): 보상을 주고/받은 캐릭터 ID
- **`sessionId`** (Number): (옵션) 보상이 발생한 출처 세션 ID
- **`amount`** (Number): 획득 및 소모량 (양/음수)
- **`reason`** (String): 변동 사유 명칭
- **`beforeExp` / `beforeCurrency`** (Number): 변동 전 수치
- **`afterExp` / `afterCurrency`** (Number): 변동 후 최신 적용된 수치

### 6.1 경험치(Exp) 로그 등록
- **Endpoint**: `POST /api/exp-logs`
- **Description**: 캐릭터가 세션에서 획득하거나 소모한 경험치를 기록합니다.

**Request Body** (`ExpLogInDto`)
```json
{
  "characterId": 1,
  "sessionId": 1,
  "amount": 50,
  "reason": "고블린 무리 퇴치",
  "beforeExp": 100,
  "afterExp": 150
}
```
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `amount` | `number` | **Yes** | 증감 수치 (+ 혹은 -) |
| `beforeExp` | `number` | No | 반영 전 수치 |
| `afterExp` | `number` | No | 반영 후 전체 수치 |

### 6.2 골드(Currency) 로그 등록
- **Endpoint**: `POST /api/currency-logs`
- **Request Body** 구조는 `ExpLogInDto`와 동일하며, 타겟이 화폐(Currency)로 적용됨.

---

## 🗄️ Appendix: Database Schema (DDL 구조 참조)
> 주요 테이블의 물리적 DDL(Data Definition Language) 구조입니다. (관계형 데이터베이스 Postgres 기반 Drizzle ORM 매핑 스키마 기준)

### ⚙️ 공통 Audit 컬럼 (Default Columns)
모든 테이블은 다음 메타데이터 컬럼을 갖습니다.
- `use_yn` (varchar 1): 사용 여부 (Default: 'Y')
- `delete_yn` (varchar 1): 삭제 여부 (Default: 'N')
- `creator_id`, `updater_id`, `deleter_id` (integer)
- `created_date`, `updated_date` (timestamp): 자동 생성 및 갱신 시각 지정

### 1. `users` (사용자)
| Column | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | serial | Primary Key |
| `name` | varchar(100) | Not Null |
| `discord_id` | varchar(50) | Not Null |
| `role` | varchar(10) | Not Null, Default: 'USER' (`ADMIN`, `USER`) |

### 2. `campaigns` (캠페인)
| Column | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | serial | Primary Key |
| `name` | varchar(100) | Nullable |
| `start_date` | timestamp | Not Null |
| `end_date` | timestamp | Nullable |

### 3. `campaign_members` (캠페인 참여자)
| Column | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | serial | Primary Key |
| `campaign_id` | integer | Not Null *(FK -> campaigns)* |
| `user_id` | integer | Not Null *(FK -> users)* |
| `role` | varchar(20) | Default: 'PLAYER' (e.g. `MASTER`, `PLAYER`) |

### 4. `characters` (캐릭터)
| Column | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | serial | Primary Key |
| `campaign_id` | integer | Not Null *(FK -> campaigns)* |
| `user_id` | integer | Not Null *(FK -> users)* |
| `name` | varchar(100) | Not Null |
| `level` | integer | Default: 1 |
| `exp` | integer | Default: 0 |
| `currency` | integer | Default: 0 |
| `classes` | json | `[{class: string, subclass: string}]` 포맷 |

### 5. `sessions` (플레이 세션)
| Column | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | serial | Primary Key |
| `campaign_id` | integer | Not Null *(FK -> campaigns)* |
| `title` | varchar(200) | Not Null |
| `play_date` | timestamp | Nullable |
| `master_id` | integer | Nullable *(FK -> users)* |
| `exp_reward` | integer | Default: 0 |
| `gold_reward` | integer | Default: 0 |

### 6. `exp_logs` & `currency_logs` (재화 로그 공통 구조)
| Column | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | serial | Primary Key |
| `character_id` | integer | Not Null *(FK -> characters)* |
| `session_id` | integer | Nullable *(FK -> sessions)* |
| `amount` | integer | Not Null |
| `reason` | text | Nullable |
| `before_exp/currency` | integer | 변동 이전 수치 |
| `after_exp/currency` | integer | 변동 이후 수치 |

### 7. `session_characters` (세션 참가 캐릭터 릴레이션 M:N)
| Column | Type | Constraints / Default |
| :--- | :--- | :--- |
| `id` | serial | Primary Key |
| `session_id` | integer | Not Null *(FK -> sessions)* |
| `character_id` | integer | Not Null *(FK -> characters)* |
