# 데이터베이스 스키마 입력값 정리

## 기준

- 입력 필수값: `notNull()` 이고 기본값이 없어 insert 시 직접 제공해야 하는 값
- 자동/기본값: identity, `default(...)`, `defaultNow()`, `$onUpdate(...)` 로 자동 처리되거나 생략 가능한 값
- 선택값: nullable 컬럼

---

## 0. 공통 메타 필드

> 대부분의 테이블에 포함되는 공통 컬럼입니다.
> 단, `character_classes` 테이블에는 적용되지 않습니다.

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| id | bigint | 자동 생성 ID (Primary Key, Identity) |
| useYn | char(1) | 사용 여부 (기본값: Y, nullable) |
| deleteYn | char(1) | 삭제 여부 (기본값: N, nullable) |
| createDate | timestamp with timezone | 생성일시 (기본값: now, not null) |
| updateDate | timestamp with timezone | 수정일시 (기본값: now, update 시 자동 갱신, nullable) |

### 선택값

| 필드 | 타입 | 설명 |
|------|------|------|
| creatorId | bigint | 생성자 ID |
| updaterId | bigint | 수정자 ID |
| deleterId | bigint | 삭제자 ID |
| deleteDate | timestamp with timezone | 삭제일시 |

---

## 1. Users (사용자)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| discordId | varchar(100) | 디스코드 ID (unique) |
| name | varchar(50) | 사용자 이름 |
| email | varchar(100) | 이메일 (unique) |

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| role | enum(user_role) | 사용자 권한 (기본값: ROLE_USER, not null) |

---

## 2. Campaigns (캠페인)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | bigint | 생성자 ID (외래키) |
| name | varchar(50) | 캠페인 이름 (unique) |

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| status | enum(status) | 상태 (기본값: PREPARING, not null) |

### 선택값

| 필드 | 타입 | 설명 |
|------|------|------|
| description | varchar(1000) | 캠페인 설명 |
| startDate | timestamp with timezone | 시작일 |
| endDate | timestamp with timezone | 종료일 |

---

## 3. Campaign Members (캠페인 멤버)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | bigint | 사용자 ID (외래키) |
| campaignId | bigint | 캠페인 ID (외래키) |

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| role | enum(campaign_role) | 역할 (기본값: PLAYER, not null) |

### 제약사항

| 항목 | 설명 |
|------|------|
| uniqueIndex | `(userId, campaignId)` 조합 unique |

---

## 4. Characters (캐릭터)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | bigint | 소유자 ID (외래키) |
| name | varchar(50) | 캐릭터 이름 |
| race | varchar(30) | 종족 |

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| status | enum(character_status) | 상태 (기본값: ACTIVE, not null) |
| startLevel | integer | 시작 레벨 (기본값: 0, not null) |
| startExp | integer | 시작 경험치 (기본값: 0, not null) |

### 선택값

| 필드 | 타입 | 설명 |
|------|------|------|
| campaignId | bigint | 캠페인 ID (외래키) |
| str | integer | 근력 |
| dex | integer | 민첩 |
| con | integer | 건강 |
| int | integer | 지능 |
| wis | integer | 지혜 |
| cha | integer | 매력 |
| ac | integer | 방어력 |
| hp | integer | 체력 |
| speed | text | 이동속도 |
| vision | text | 시야 |
| skills | text | 기술 |
| advantage | text | 이점 |
| disadvantage | text | 불이익 |
| resistance | text | 저항 |
| immunity | text | 면역 |
| startCurrencyCp | integer | 시작 화폐 (구리) |
| startCurrencySp | integer | 시작 화폐 (은) |
| startCurrencyEp | integer | 시작 화폐 (electrum) |
| startCurrencyGp | integer | 시작 화폐 (금) |
| startCurrencyPp | integer | 시작 화폐 (백금) |
| mainHand | varchar(100) | 주무기 |
| offHand | varchar(100) | 보조무기 |
| armor | varchar(100) | 갑옷 |
| head | varchar(100) | 머리 |
| gauntlet | varchar(100) | 장갑 |
| boots | varchar(100) | 신발 |
| belt | varchar(100) | 벨트 |
| cloak | varchar(100) | 망토 |
| accessory1 | varchar(100) | 액세서리 1 |
| accessory2 | varchar(100) | 액세서리 2 |
| accessory3 | varchar(100) | 액세서리 3 |
| accessory4 | varchar(100) | 액세서리 4 |
| reqStrDex8 | varchar(100) | 근력/민첩 8 요구 |
| reqStrDex10 | varchar(100) | 근력/민첩 10 요구 |
| reqStrDex12 | varchar(100) | 근력/민첩 12 요구 |
| reqStrDex14 | varchar(100) | 근력/민첩 14 요구 |
| reqStr16 | varchar(100) | 근력 16 요구 |
| reqStr18 | varchar(100) | 근력 18 요구 |
| reqStr20 | varchar(100) | 근력 20 요구 |
| reqCon8 | varchar(100) | 건강 8 요구 |
| reqCon10 | varchar(100) | 건강 10 요구 |
| reqCon12 | varchar(100) | 건강 12 요구 |
| reqCon14 | varchar(100) | 건강 14 요구 |
| reqCon16 | varchar(100) | 건강 16 요구 |
| reqCon18 | varchar(100) | 건강 18 요구 |
| reqCon20 | varchar(100) | 건강 20 요구 |

---

## 5. Character Classes (캐릭터 클래스)

> 이 테이블은 공통 메타 필드를 사용하지 않습니다.

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| characterId | bigint | 캐릭터 ID (외래키) |
| className | varchar(50) | 클래스 이름 |
| level | integer | 레벨 |

### 제약사항

| 항목 | 설명 |
|------|------|
| primaryKey | `(characterId, className)` 복합 PK |

---

## 6. Docs (문서)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | bigint | 작성자 ID (외래키) |
| title | varchar(200) | 제목 |
| category | varchar(50) | 카테고리 |

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| status | enum(doc_status) | 상태 (기본값: DRAFT, not null) |
| visibility | enum(doc_visibility) | 공개 범위 (기본값: PUBLIC, not null) |

### 선택값

| 필드 | 타입 | 설명 |
|------|------|------|
| description | varchar(500) | 설명 |
| content | text | 내용 |

---

## 7. Log Histories (로그 이력)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | bigint | 사용자 ID (외래키) |
| tableName | varchar(50) | 테이블명 |
| targetId | bigint | 대상 ID |
| actionType | varchar(20) | 액션 타입 |

### 선택값

| 필드 | 타입 | 설명 |
|------|------|------|
| oldData | jsonb | 변경 전 데이터 |
| newData | jsonb | 변경 후 데이터 |
| description | varchar(1000) | 설명 |

---

## 8. Consume Histories (소비 이력)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| userId | bigint | 사용자 ID (외래키) |
| characterId | bigint | 캐릭터 ID (외래키) |
| description | varchar(2000) | 설명 |
| beforeCurrency | jsonb | 변경 전 화폐 |
| afterCurrency | jsonb | 변경 후 화폐 |

---

## 9. Sessions (세션)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| campaignId | bigint | 캠페인 ID (외래키) |
| no | integer | 회차 번호 |
| name | varchar(50) | 세션 이름 |

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| status | enum(status) | 기본값은 PREPARING 이지만 nullable 이므로 명시적으로 `null` 저장 가능 |

### 선택값

| 필드 | 타입 | 설명 |
|------|------|------|
| description | varchar(2000) | 세션 설명 |
| maxPlayer | integer | 최대 플레이어 수 |
| rewardExp | integer | 보상 경험치 |
| rewardGold | integer | 보상 골드 |
| playDate | timestamp with timezone | 플레이 날짜 |

---

## 10. Session Players (세션 참가자)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| sessionId | bigint | 세션 ID (외래키) |
| userId | bigint | 사용자 ID (외래키) |
| characterId | bigint | 캐릭터 ID (외래키) |

### 자동/기본값

| 필드 | 타입 | 설명 |
|------|------|------|
| role | enum(session_role) | 역할 (기본값: PLAYER, not null) |

---

## 11. Session Logs (세션 로그)

### 입력 필수값

| 필드 | 타입 | 설명 |
|------|------|------|
| sessionId | bigint | 세션 ID (외래키) |
| userId | bigint | 사용자 ID (외래키) |
| title | varchar(100) | 제목 |

### 선택값

| 필드 | 타입 | 설명 |
|------|------|------|
| content | text | 내용 |
| fileUrl | varchar(255) | 파일 URL |
