# PDCA 계획서: 세션 API 세트 구축

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| :--- | :--- |
| 피처명 | 세션 API 세트 (Session API Set) |
| 작성일 | 2026-03-15 |
| 범위 | 세션 목록/상세/생성/수정/삭제, 세션 플레이어 등록/취소 |

## 2. 배경 및 동기 (Background & Motivation)
- **문제점**: 캠페인 진행의 핵심인 세션(Session) 데이터를 관리하기 위한 CRUD 기능이 부재함. 세션 보상 설정 및 참여 캐릭터 관리 기능이 필요함.
- **해결책**: 세션 전용 엔드포인트를 구축하고, `X-Discord-ID` 헤더 기반의 보안 검증과 관계 데이터(캠페인, 플레이어, 로그 등) 로딩을 구현함.
- **기능적 UX 기대효과**: 마스터가 세션을 생성하고 플레이어를 모집하며, 보상(경험치, 골드)을 체계적으로 관리할 수 있음.
- **핵심 가치**: 세션 기반의 게임 데이터 흐름(경험치, 골드 합산)의 기초 마련.

## 3. 범위 및 영향 (Scope & Impact)
- **영향을 받는 모듈**: 
  - `src/server/api/sessions/` (신규 생성)
- **주요 파일**:
  - `src/server/db/table/sessions.table.ts`
  - `src/server/db/table/relations.ts`
  - `src/server/types/dto.types.ts`
  - `src/server/constant/response-message.ts`

## 4. 제안된 솔루션 (Proposed Solution)
### API 엔드포인트
1. **GET `/api/sessions`**: 세션 목록 조회 (`with` 캠페인 정보 포함).
2. **POST `/api/sessions`**: 세션 생성 및 보상(Exp, Gold) 설정.
3. **GET `/api/sessions/[id]`**: 세션 상세 정보 (`with` 캠페인, 참여 플레이어, 로그 포함).
4. **PUT `/api/sessions/[id]`**: 세션 정보(이름, 설명, 보상 등) 및 상태(Status) 수정.
5. **DELETE `/api/sessions/[id]`**: 세션 삭제 (Soft Delete: `useYn='N'`, `deleteYn='Y'`).
6. **POST `/api/sessions/[id]/players`**: 특정 캐릭터를 세션 플레이어로 등록 (`characterId` 필요).
7. **DELETE `/api/sessions/[id]/players/[userId]`**: 유저 ID 기반으로 세션 참여 취소.

### 보안 및 검증 (Security)
- 모든 `POST`, `PUT`, `DELETE` 요청 시 `event.req.headers.get('X-Discord-ID')` 검증.
- 캠페인 소유자(마스터) 또는 권한이 있는 유저만 세션을 수정/삭제할 수 있도록 소유권 확인 로직 강화.

## 5. 단계별 이행 계획 (Phased Implementation Plan)
- **1단계: API 디렉토리 및 조회 API 구축** (목록 및 상세 조회)
- **2단계: 세션 CRUD 구현** (생성, 수정, 삭제)
- **3단계: 세션 플레이어 관리 구현** (참여 등록 및 취소)
- **4단계: 보안 로직 정교화** (캠페인 마스터 권한 확인 등)

## 6. 검증 및 테스트 계획 (Verification & Testing)
- **관계 데이터 확인**: 세션 상세 조회 시 캠페인 정보와 참여 캐릭터 목록이 정확히 나오는지 확인.
- **보상 정합성**: 세션 생성 시 설정한 경험치와 골드가 올바르게 저장되는지 확인.
- **권한 테스트**: 타인의 세션을 수정/삭제하려는 시도 시 차단되는지 확인.
