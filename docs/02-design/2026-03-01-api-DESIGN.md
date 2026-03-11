# Phase 4: API 명세서 (Backend API Specification)

> **목표**: 디스코드(Discord) 봇 혹은 외부 클라이언트가 연동할 수 있도록 Nuxt 3 (Nitro) 기반의 RESTful API 설계 초안을 마련합니다. 
> **인증 규칙(임시)**: API 호출 시 헤더(Header) `X-Discord-ID` 에 디스코드 고유 ID를 담아 전송하여 유저를 식별하는 것을 기본 통신 규약으로 가정합니다.
> **공통 규칙 (Soft Delete)**: 모든 `DELETE` 요청은 물리적 삭제(Hard Delete)가 아닌 논리적 삭제(Soft Delete)로 처리됩니다. (`delete_yn = 'Y'`, `deleted_date` 업데이트). 목록 조회(`GET`) 시에는 기본적으로 `delete_yn = 'N'` 인 데이터만 반환합니다.

## 공통 응답 규격 (Global Response Format)
모든 API 응답은 프론트엔드(`app/types/common.types.ts`)와 맞추기 위해 다음의 JSON 형태를 래핑(Wrap)하여 반환합니다. 리스트 데이터는 `data` 필드 내에 `{ list: [], totalCnt: 0 }` 형태로 감싸집니다.
```json
{
  "error": false,
  "message": "성공/실패 메시지",
  "data": { ... }, // 리스트일 경우 { "list": [...], "totalCnt": ... }
  "code": 200, // ResponseCode enum
  "responseTime": 1709292812
}
```

---

## 1. 유저 (Users)

### 1.1 유저 목록 조회
- **Endpoint**: `GET /api/users`
- **Description**: 전체 유저 목록을 반환합니다.

### 1.2 유저 단건 조회
- **Endpoint**: `GET /api/users/:id`
- **Description**: 특정 ID의 유저 정보를 반환합니다.

### 1.3 유저 생성 (디스코드 정보 연동)
- **Endpoint**: `POST /api/users`
- **Request Body**:
  ```json
  {
    "discordId": 123456789,
    "name": "DiscordNickname"
  }
  ```
- **Response** `200 OK`:
  ```json
  {
    "error": false,
    "message": "성공",
    "data": { "id": 1, "discordId": 123456789, "name": "DiscordNickname" },
    "code": "SUCCESS",
    "responseTime": 1709292812
  }
  ```
- **Description**: 새로운 유저를 생성합니다. (기존 가입 시 정보 갱신 처리 가능)

### 1.4 유저 정보 수정
- **Endpoint**: `PATCH /api/users/:id`
- **Request Body**:
  ```json
  {
    "name": "NewNickname"
  }
  ```

### 1.5 유저 삭제 (Soft Delete)
- **Endpoint**: `DELETE /api/users/:id`

---

## 2. 캠페인 (Campaigns)

### 2.1 캠페인 목록 조회
- **Endpoint**: `GET /api/campaigns`
- **Description**: 생성되거나 참여 중인 캠페인 목록을 조회합니다. 시스템 관리자일 경우 전체 조회가 가능합니다.

### 2.2 캠페인 단건 조회
- **Endpoint**: `GET /api/campaigns/:id`

### 2.3 캠페인 생성
- **Endpoint**: `POST /api/campaigns`
- **Header**: `X-Discord-ID: 123456789`
- **Request Body**:
  ```json
  {
    "name": "왕좌의 탈환",
    "mainMaster": "홍길동마스터",
    "startDate": "2026-03-01T00:00:00Z"
  }
  ```
- **Description**: 캠페인을 생성하며, 요청자를 `campaign_members` 테이블에 `role: "MASTER"`로 자동 등록합니다.

### 2.4 캠페인 정보 수정
- **Endpoint**: `PATCH /api/campaigns/:id`
- **Header**: `X-Discord-ID: 123456789` (마스터 권한 필요)
- **Request Body**:
  ```json
  {
    "name": "왕좌의 탈환 (수정됨)",
    "endDate": "2026-12-31T00:00:00Z"
  }
  ```

### 2.5 캠페인 삭제 (Soft Delete)
- **Endpoint**: `DELETE /api/campaigns/:id`
- **Header**: `X-Discord-ID: 123456789` (마스터 권한 필요)

---

## 3. 캐릭터 (Characters)

### 3.1 특정 캠페인의 캐릭터 목록 조회
- **Endpoint**: `GET /api/campaigns/:campaignId/characters`

### 3.2 캐릭터 단건 조회
- **Endpoint**: `GET /api/characters/:id`

### 3.3 캐릭터 생성
- **Endpoint**: `POST /api/campaigns/:campaignId/characters`
- **Header**: `X-Discord-ID: 123456789`
- **Request Body**:
  ```json
  {
    "name": "레골라스",
    "classes": [
      { "class": "레인저", "subclass": "헌터" },
      { "class": "파이터", "subclass": "챔피언" }
    ],
    "level": 1,
    "exp": 0,
    "currency": 100
  }
  ```

### 3.4 캐릭터 정보 수정
- **Endpoint**: `PATCH /api/characters/:id`
- **Header**: `X-Discord-ID: 123456789` (본인 혹은 마스터 권한)
- **Request Body**:
  ```json
  {
    "level": 2,
    "classes": [
      { "class": "레인저", "subclass": "헌터" },
      { "class": "파이터", "subclass": "배틀마스터" }
    ]
  }
  ```

### 3.5 캐릭터 삭제 (Soft Delete)
- **Endpoint**: `DELETE /api/characters/:id`
- **Header**: `X-Discord-ID: 123456789`

---

## 4. 세션 (Sessions)

### 4.1 특정 캠페인의 세션 목록 조회
- **Endpoint**: `GET /api/campaigns/:campaignId/sessions`

### 4.2 세션 단건 조회
- **Endpoint**: `GET /api/sessions/:id`

### 4.3 세션 생성 및 일괄 보상 등록
- **Endpoint**: `POST /api/campaigns/:campaignId/sessions`
- **Header**: `X-Discord-ID: 123456789` (마스터 권한)
- **Request Body**:
  ```json
  {
    "title": "#1 고블린의 습격",
    "playDate": "2026-03-01T12:00:00Z",
    "expReward": 300,
    "goldReward": 50,
    "participantCharacterIds": [1, 2, 5]
  }
  ```
- **Description**: 
  1. `sessions` 테이블 등록 (masterId 매핑)
  2. `session_characters` 연결 테이블 저장
  3. 참여한 캐릭터들에게 `exp_logs`와 `currency_logs` 자동 생성 및 잔액 트랜잭션 업데이트

### 4.4 세션 수정
- **Endpoint**: `PATCH /api/sessions/:id`
- **Request Body**:
  ```json
  {
    "title": "#1 고블린의 습격 (수정됨)"
  }
  ```
- **Description**: 보상치나 참가자가 변경될 경우, 기존에 적재된 로그들의 롤백/재계산 트랜잭션이 수반되어야 하므로 매우 주의가 필요한 엔드포인트입니다. (추후 별도 로직 분리 필요 가능)

### 4.5 세션 삭제 (Soft Delete)
- **Endpoint**: `DELETE /api/sessions/:id`
- **Description**: 세션 삭제 시 관련 로그들의 삭제 처리에 대한 정책 결정이 필요합니다.

---

## 5. 로그 (Logs - Exp & Currency)
로그의 특성상 `UPDATE` 및 `DELETE`는 데이터 무결성을 위해 일반적인 원칙으로는 허용되지 않으나, 관리 목적의 `Soft Delete`는 지원할 수 있습니다. 상쇄(Offset) 로그를 추가하는 방식이 더 권장됩니다.

### 5.1 캐릭터 개인 로그 추가 (경험치/재화 수동 부여 및 차감)
- **Endpoint**: `POST /api/characters/:characterId/logs`
- **Header**: `X-Discord-ID: 123456789` (마스터 혹은 본인 캐릭터)
- **Request Body**:
  ```json
  {
    "type": "EXP", // "EXP" or "CURRENCY"
    "amount": -50,
    "reason": "함정 밟음 페널티"
  }
  ```

### 5.2 캐릭터 로그 타임라인 조회
- **Endpoint**: `GET /api/characters/:characterId/logs`
- **Query Params**: `?type=ALL&page=1` (type: EXP, CURRENCY, ALL)
