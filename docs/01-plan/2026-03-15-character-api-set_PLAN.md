# PDCA 계획서: 캐릭터 API 세트 구축

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| :--- | :--- |
| 피처명 | 캐릭터 API 세트 (Character API Set) |
| 작성일 | 2026-03-15 |
| 범위 | 캐릭터 및 클래스 CRUD API, 보안(Discord ID 헤더), 관계 데이터 로딩 |

## 2. 배경 및 동기 (Background & Motivation)
- **문제점**: 현재 캐릭터 시스템은 기본적인 목록 조회만 가능하며, 세션 및 캠페인 관리를 위한 상세 CRUD 기능과 보안 검증이 부족함.
- **해결책**: 캐릭터와 클래스에 대한 종합적인 API 세트를 구축하고, `X-Discord-ID` 헤더 기반의 보안 체크와 관계 데이터(유저, 캠페인, 클래스, 세션) 로딩을 구현함.
- **기능적 UX 기대효과**: 플레이어와 마스터가 캐릭터의 능력치와 클래스 정보를 원활하게 관리하고 조회할 수 있음.
- **핵심 가치**: 데이터 무결성 확보 및 캐릭터 소유권 검증을 통한 보안 강화.

## 3. 범위 및 영향 (Scope & Impact)
- **영향을 받는 모듈**: 
  - `src/server/api/characters/` (캐릭터 주요 엔드포인트)
- **주요 파일**:
  - `src/server/db/table/characters.table.ts`
  - `src/server/db/table/relations.ts`
  - `src/server/types/dto.types.ts`
  - `src/server/utils/base-response.ts`
  - `src/server/utils/where.helper.ts`

## 4. 제안된 솔루션 (Proposed Solution)
### API 엔드포인트
1. **GET `/api/characters`**: 관계 데이터(user, campaign, classes, sessions) 포함 및 `dynamic` where 헬퍼 적용.
2. **POST `/api/characters`**: 캐릭터 생성 (`X-Discord-ID` 체크 필수).
3. **GET `/api/characters/[id]`**: 상세 조회 (`user`, `campaign`, `classes`, `sessions` 포함).
4. **PUT `/api/characters/[id]`**: 기본 정보 수정 (`X-Discord-ID` 기반 소유권 확인).
5. **DELETE `/api/characters/[id]`**: 캐릭터 삭제 (`X-Discord-ID` 기반 소유권 확인).
6. **PUT `/api/characters/[id]/status`**: 캐릭터 상태(Active, Resting 등) 업데이트.
7. **POST `/api/characters/[id]/classes`**: `character_classes` 테이블에 클래스 레코드 추가.
8. **PUT `/api/characters/[id]/classes/[className]`**: 클래스 레벨 및 정보 수정.
9. **DELETE `/api/characters/[id]/classes/[className]`**: 클래스 레코드 제거.

### 보안 및 검증 (Security)
- 모든 `POST`, `PUT`, `DELETE` 요청 시 `getHeader(event, 'X-Discord-ID')`를 통해 헤더 존재 여부 및 유효성 확인.
- 요청한 디스크코드 ID가 해당 캐릭터의 소유자(User)와 일치하는지 검증.

## 5. 단계별 이행 계획 (Phased Implementation Plan)
- **1단계: 기초 및 조회 API** (캐릭터 목록 및 상세 조회 구현)
- **2단계: 캐릭터 기본 CRUD** (생성, 수정, 삭제, 상태 변경 구현)
- **3단계: 클래스 관리 API** (클래스 추가, 수정, 제거 구현)
- **4단계: 보안 강화 및 검증** (디스코드 ID 기반 소유권 검증 로직 최종 적용)

## 6. 검증 및 테스트 계획 (Verification & Testing)
- **데이터 검증**: GET 요청 시 중첩된 관계 객체들이 정확히 반환되는지 확인.
- **보안 테스트**: `X-Discord-ID` 헤더 없이 CUD 요청 시 실패 처리 여부 확인.
- **무결성 테스트**: 클래스 수정 사항이 캐릭터 상세 정보에 실시간으로 반영되는지 확인.
