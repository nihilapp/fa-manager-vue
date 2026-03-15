# PDCA 설계서: 세션 API 세트 구축

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| :--- | :--- |
| 피처명 | 세션 API 세트 (Session API Set) |
| 작성일 | 2026-03-15 |
| 설계 범위 | 세션 CRUD, 참여 관리, 보안 검증, DTO 매핑 |

## 2. API 상세 설계 (API Specification)

### 2.1. 세션 목록 및 상세 조회 (GET /api/sessions, /api/sessions/[id])
- **목록 조회**: `index.get.ts`를 사용하며, `dynamic` where 헬퍼를 통해 `campaignId`, `status` 등으로 필터링 지원.
- **상세 조회**: `[id].get.ts`를 통해 특정 세션의 모든 정보 조회.
- **관계 조회 (with)**: `campaign`, `players` (with `character`, `user`), `logs` 정보를 포함하여 반환.

### 2.2. 세션 생성 및 수정 (POST, PUT /api/sessions)
- **POST**: `SessionInDto`를 사용하여 `campaignId`, `name`, `rewardExp`, `rewardGold` 등을 필수 값으로 입력받음.
- **PUT**: 특정 세션의 메타데이터와 상태(`PREPARING`, `IN_PROGRESS`, `COMPLETED` 등)를 수정.
- **보안**: 해당 캠페인의 마스터(`userId` 일치 확인)만 세션 생성 및 수정이 가능하도록 제한.

### 2.3. 세션 삭제 (DELETE /api/sessions/[id])
- **로직**: Soft Delete 수행 (`useYn='N'`, `deleteYn='Y'`).
- **권한**: 캠페인 마스터만 가능.

### 2.4. 세션 플레이어 관리 (POST, DELETE /api/sessions/[id]/players/...)
- **POST**: 세션에 캐릭터 등록. `characterId`를 전달받아 `session_players` 테이블에 삽입.
- **DELETE**: 세션 참여 취소. `userId` 파라미터를 통해 해당 유저의 캐릭터를 세션에서 제거.

## 3. 보안 로직 (Security & Validation)

### 3.1. 캠페인 마스터 권한 확인
- 세션 관련 모든 CUD 작업 전, `campaignsTable`에서 해당 `campaignId`를 조회하여 소유자(`userId`)가 요청자(디스코드 ID 기반 유저)와 일치하는지 확인.

### 3.2. 상태값 유효성 검증
- `Status` Enum (`PREPARING`, `IN_PROGRESS` 등) 내의 값만 허용하도록 검증 로직 적용.

## 4. 데이터베이스 매핑 (Data Mapping)
- **InDto**: `SessionInDto`, `SessionPlayerInDto` 활용.
- **OutDto**: `SessionOutDto`, `SessionPlayerOutDto` 활용하여 관계 데이터 포함.

## 5. 예외 처리 계획 (Exception Handling)
- 캠페인 미존재: `404 Not Found`
- 마스터 권한 부족: `403 Forbidden`
- 이미 참여 중인 캐릭터: `409 Conflict` (선택적 구현)
