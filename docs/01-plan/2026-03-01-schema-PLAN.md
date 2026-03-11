# Phase 1: Schema & Terminology (데이터 모델 및 용어 사전)

## 1. 용어 사전 (Terminology)
프로젝트 전반(기획, 디자인, 코드)에서 통일된 의사소통을 위해 핵심 용어를 정의합니다.

- **User (사용자)**: 시스템에 접속하는 모든 사람. 고유한 디스코드 ID(`discordId`)로 식별됨.
- **Campaign (캠페인)**: TRPG의 한 시나리오 혹은 장기 플레이 방 단위. 고유한 식별자와 마스터(방장) 정보를 가짐.
- **Campaign Member (캠페인 참여자)**: 특정 캠페인에 소속된 사용자. `role` 필드를 통해 마스터(MASTER)인지 일반 플레이어(PLAYER)인지 구분됨.
- **PC / Character (캐릭터)**: 플레이어가 조종하는 플레이어 캐릭터(Player Character). 특정 캠페인 내에서 특정 사용자가 생성 및 소유함.
- **Session (세션)**: 캠페인 내에서 진행된 1회의 플레이 기록. (예: 1화, 2화)
- **Log (로그)**: 캐릭터 혹은 캠페인 내에서 변경된 수치(경험치, 자원 등)의 히스토리. 추적을 위해 필수로 저장되는 이벤트.
  - **Exp Log (경험치 로그)**: 캐릭터의 경험치 획득/차감 내역.
  - **Currency Log (소비 로그)**: 캐릭터의 소지금이나 아이템 자원 변동 내역.

---

## 2. 데이터 모델링 (ERD 설계안)

### **테이블 목록 (Entities)**

1. **`users` (사용자)**
   - `id`: PK
   - `name`: (Discord Nickname 등)
   - `discord_id`: 고유 식별자

2. **`campaigns` (캠페인 본체)**
   - `id`: PK
   - `name`: 캠페인 제목
   - `main_master`: 기본 안내용 마스터 이름
   - `start_date` / `end_date`: 진행 기간

3. **`campaign_members` (캠페인 참여자 맵핑 - 1:N ↔ 1:N)**
   - `id`: PK
   - `campaign_id`: FK -> `campaigns(id)`
   - `user_id`: FK -> `users(id)`
   - `role`: 권한 (MASTER, PLAYER)

4. **`characters` (캐릭터)**
   - `id`: PK
   - `campaign_id`: FK -> `campaigns(id)`
   - `user_id`: FK -> `users(id)` (소유자)
   - `name`: 캐릭터명
   - `level`: 레벨
   - `exp`: 현재 경험치
   - `currency`: 현재 소지금/자원
   - `classes`: JSON 타입. 구조: `[{ "class": "파이터", "subclass": "블라블라" }, ...]` (멀티 클래스 지원)

5. **`sessions` (세션/회차 정보)**
   - `id`: PK
   - `campaign_id`: FK -> `campaigns(id)`
   - `title`: 세션명/회차명
   - `play_date`: 플레이 일자
   - `master_id`: FK -> `users(id)` (해당 세션 진행 마스터)
   - `exp_reward`: 지급된 경험치 (해당 세션 참가자 일괄 지급 등의 기준치)
   - `gold_reward`: 지급된 재화 (골드 등)

6. **`session_characters` (세션-캐릭터 참여자 맵핑 - 1:N ↔ 1:N)**
   - `id`: PK
   - `session_id`: FK -> `sessions(id)`
   - `character_id`: FK -> `characters(id)`

7. **`exp_logs` (경험치 변동 로그)**
   - `id`: PK
   - `character_id`: FK -> `characters(id)`
   - `session_id`: FK -> `sessions(id)` (어떤 세션에서 발생했는지 - nullable)
   - `amount`: 변동치 (+100, -50 등)
   - `reason`: 사유
   - `before_exp` / `after_exp`: 검증용 전/후 잔액

8. **`currency_logs` (자원/소지금 변동 로그)**
   - `id`: PK
   - `character_id`: FK -> `characters(id)`
   - `session_id`: FK -> `sessions(id)` (nullable)
   - `amount`: 변동치
   - `reason`: 사유
   - `before_currency` / `after_currency`: 검증용 전/후 잔액

> **공통 컬럼 (Default Columns)**
> 모든 테이블에는 다음의 공통 컬럼이 포함됩니다. (접근 제어 및 감사용)
> `use_yn`(사용여부), `delete_yn`(삭제여부), `creator_id`, `created_date`, `updater_id`, `updated_date`, `deleter_id`, `deleted_date`

---

## 3. 관계성 요약 (Relationships)
- **User (1) - (N) Campaign Member (N) - (1) Campaign**: 사용자와 캠페인은 다대다 관계이며, `campaign_members` 테이블로 풀어냅니다.
- **Campaign (1) - (N) Character**: 한 캠페인에는 여러 캐릭터가 소속됩니다.
- **User (1) - (N) Character**: 한 사용자는 여러 캐릭터를 소유할 수 있습니다.
- **Campaign (1) - (N) Session**: 한 캠페인에는 여러 회차(세션)의 기록이 남습니다.
- **Character (1) - (N) Logs (Exp/Currency)**: 한 캐릭터는 다수의 경험치/소비 로그를 남깁니다.
