# PDCA 설계서: 소모 내역 API 세트 구축

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| :--- | :--- |
| 피처명 | 소모 내역 API 세트 (Consume History API Set) |
| 작성일 | 2026-03-15 |
| 설계 범위 | 소모 내역 CRUD, 소유권 검증, DTO 설계 |

## 2. API 상세 설계 (API Specification)

### 2.1. 소모 내역 목록 조회 (GET /api/consume-histories)
- **로직**: `buildDrizzleWhere`에 `dynamic` 연산자를 적용하여 `characterId`, `userId`, `createDate` 등으로 필터링 지원.
- **관계 데이터 (with)**: `user`, `character` 정보 포함.
- **페이징**: `page`, `size` 쿼리 파라미터를 통한 페이징 지원.

### 2.2. 소모 내역 생성 (POST /api/consume-histories)
- **보안**: `event.req.headers.get('X-Discord-ID')` 확인 및 해당 유저의 `userId` 할당.
- **로직**: `beforeCurrency`, `afterCurrency` (JSONB) 정보를 포함하여 `consume_histories` 테이블에 삽입.
- **데이터 흐름**: 생성 직후 해당 캐릭터의 보유 골드 계산 시 소모액만큼 자동 차감 반영.

### 2.3. 소모 내역 수정 (PUT /api/consume-histories/[id])
- **보안**: 해당 기록의 `userId`와 요청자(디스코드 ID 기반 유저) 일치 여부 확인.
- **로직**: `description` 또는 화폐 내역 수정. `updaterId`, `updateDate` 기록.

### 2.4. 소모 내역 삭제 (DELETE /api/consume-histories/[id])
- **보안**: 해당 기록의 소유자만 삭제 가능.
- **로직**: Soft Delete 적용 (`useYn='N'`, `deleteYn='Y'`). `deleterId`, `deleteDate` 기록.

## 3. DTO 및 관계 설계 (DTO & Relation Mapping)
- **Input DTO**: `ConsumeHistoryInDto` 사용.
- **Output DTO**: `ConsumeHistoryOutDto` 사용하며 `user`, `character` 정보 포함.

## 4. 예외 처리 계획 (Exception Handling)
- 기록 미존재: `404 Not Found` (RESPONSE_MESSAGE.NOT_FOUND)
- 권한 부족: `403 Forbidden` (RESPONSE_MESSAGE.USER_FORBIDDEN)
- 헤더 누락: `401 Unauthorized` (RESPONSE_MESSAGE.REQUIRE_DISCORD_ID)
