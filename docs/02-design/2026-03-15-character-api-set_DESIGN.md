# PDCA 설계서: 캐릭터 API 세트 구축

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| :--- | :--- |
| 피처명 | 캐릭터 API 세트 (Character API Set) |
| 작성일 | 2026-03-15 |
| 설계 범위 | API 엔드포인트 설계, DTO 매핑, 보안 검증 로직, DB 관계 조회 설계 |

## 2. API 상세 설계 (API Specification)

### 2.1. 캐릭터 목록 조회 (GET /api/characters)
- **로직**: `buildDrizzleWhere`에 `dynamic` 연산자를 적용하여 필터링.
- **관계 데이터 (with)**: `user`, `campaign`, `classes`, `sessions`.
- **응답**: `BaseResponse.page`를 통한 페이징 데이터 반환.

### 2.2. 캐릭터 생성 (POST /api/characters)
- **보안**: `X-Discord-ID` 헤더 확인 -> 해당 유저 존재 여부 확인 -> `userId` 할당.
- **로직**: `CharacterInDto`를 `charactersTable`에 삽입.

### 2.3. 캐릭터 상세 조회 (GET /api/characters/[id])
- **로직**: `id`로 `findFirst` 수행.
- **관계 데이터 (with)**: `user`, `campaign`, `classes`, `sessions`.

### 2.4. 캐릭터 수정 및 상태 변경 (PUT /api/characters/[id])
- **보안**: `X-Discord-ID` 헤더의 유저와 캐릭터의 `userId` 일치 여부 검증.
- **로직**: `status` 또는 기본 필드 업데이트.

### 2.5. 클래스 관리 (POST, PUT, DELETE /api/characters/[id]/classes/...)
- **POST**: `character_classes` 테이블에 `characterId`, `className`, `level` 추가.
- **PUT**: `className`을 조건으로 레벨 등 정보 수정.
- **DELETE**: 특정 클래스 제거.

## 3. 보안 매커니즘 (Security Mechanism)

### 3.1. Discord ID 검증 절차
1. `getHeader(event, 'X-Discord-ID')` 추출.
2. 유저 테이블에서 해당 `discordId`로 조회하여 `userId` 획득.
3. CUD 작업 대상 데이터의 `userId`와 조회된 `userId`를 비교하여 권한 확인.
4. 권한 부재 시 `401 Unauthorized` 또는 `403 Forbidden` 에러 반환.

## 4. 데이터베이스 및 DTO 매핑 (Data & DTO Mapping)
- **Input DTO**: `CharacterInDto`, `CharacterClassInDto` 활용.
- **Output DTO**: `CharacterOutDto`, `CharacterClassOutDto` 활용하여 관계 데이터 포함.

## 5. 예외 처리 계획 (Exception Handling)
- 캐릭터 미존재: `404 Not Found`
- 권한 부족: `403 Forbidden`
- 필수 파라미터 누락: `400 Bad Request`
- 서버 내부 오류: `500 Internal Server Error` (BaseResponse.error 활용)
