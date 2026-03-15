# PDCA 계획서: 소모 내역 API 세트 구축

## 1. 개요 (Executive Summary)
| 항목 | 내용 |
| :--- | :--- |
| 피처명 | 소모 내역 API 세트 (Consume History API Set) |
| 작성일 | 2026-03-15 |
| 범위 | 소모 내역 목록/생성/수정/삭제 API |

## 2. 배경 및 동기 (Background & Motivation)
- **문제점**: 캐릭터가 골드를 소모했을 때 이를 기록하고 증빙할 수 있는 수단이 부재하여 골드 계산 로직의 정합성을 확보하기 어려움.
- **해결책**: 캐릭터의 화폐 소모 내역을 기록하는 전용 API 세트를 구축하여, 골드 소모 시점의 비포/애프터 상태를 저장하고 추적 가능하게 함.
- **기능적 UX 기대효과**: 플레이어가 아이템 구매 등 골드 소모 내역을 직접 기록하고, 마스터가 이를 검토할 수 있음.
- **핵심 가치**: 캐릭터 자산 관리의 투명성 및 데이터 정합성 강화.

## 3. 범위 및 영향 (Scope & Impact)
- **영향을 받는 모듈**: 
  - `src/server/api/consume-histories/` (신규 생성)
- **주요 파일**:
  - `src/server/db/table/consume-histories.table.ts`
  - `src/server/db/table/relations.ts`
  - `src/server/types/dto.types.ts`

## 4. 제안된 솔루션 (Proposed Solution)
### API 엔드포인트
1. **GET `/api/consume-histories`**: 소모 내역 목록 조회 (`with` 유저, 캐릭터 정보 포함). `dynamic` where 적용.
2. **POST `/api/consume-histories`**: 새로운 소모 내역 생성. `beforeCurrency`, `afterCurrency` JSON 객체 포함.
3. **PUT `/api/consume-histories/[id]`**: 오입력된 소모 내역 수정 (소유권 확인 필수).
4. **DELETE `/api/consume-histories/[id]`**: 소모 내역 삭제 (Soft Delete 적용).

### 보안 및 검증 (Security)
- **헤더 검증**: CUD 작업 시 `event.req.headers.get('X-Discord-ID')` 필수 확인.
- **소유권 검증**: 기록을 생성/수정/삭제하는 유저가 해당 기록의 `userId`와 일치하는지 확인.
- **데이터 무결성**: 소모 전/후 화폐 정보가 유효한 `CurrencyDto` 형식인지 확인.

## 5. 단계별 이행 계획 (Phased Implementation Plan)
- **1단계: API 엔드포인트 기초 구축** (목록 조회 및 생성)
- **2단계: 수정 및 삭제 기능 구현** (소유권 검증 포함)
- **3단계: 최종 검증 및 세션 작업 전환**

## 6. 검증 및 테스트 계획 (Verification & Testing)
- **기록 생성**: 소모 내역 생성 후 캐릭터 상세 조회 시 `currentCurrencyGp`가 올바르게 차감되는지 확인.
- **관계 조회**: 목록 조회 시 캐릭터 이름과 유저 정보가 포함되어 나오는지 확인.
- **권한 테스트**: 타인의 소모 내역을 수정/삭제하려는 시도 시 403 Forbidden 처리 여부 확인.
