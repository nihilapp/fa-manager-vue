# PDCA Report: Advance Where Helper (Type Detection & Between)

- **Date:** 2026-03-14
- **Feature:** advance-where-helper
- **Status:** ✅ Completed (Gap Analysis: 100%)

## 1. 개요
- `buildPrismaWhere` 유틸리티의 타입 안전성 및 검색 편의성을 강화하였습니다.
- 쿼리 파라미터(string)를 Prisma가 연산 가능한 데이터 타입(number, Date)으로 자동 변환하고, 범위 검색(`between`) 기능을 추가하였습니다.

## 2. 변경 내역
- **타입 자동 감지 (`tryParseValue`)**:
  - 숫자로 구성된 문자열은 자동으로 `number` 타입으로 변환합니다. (단, 빈 문자열 제외)
  - `ISO8601` 형식의 날짜 문자열은 자동으로 `Date` 객체로 변환합니다.
  - `gt`, `lt`, `gte`, `lte`, `eq`, `not`, `in`, `between` 등 모든 비교 연산에 적용됩니다.
- **`between` 연산자 추가**:
  - `{ gte: min, lte: max }` 구조의 Prisma 쿼리를 생성합니다.
  - 입력값으로 배열(`[min, max]`) 또는 콤마 구분 문자열(`"min,max"`)을 모두 지원합니다.
- **`in` 연산자 고도화**:
  - 콤마로 구분된 문자열(`"1,2,3"`)이 들어올 경우 배열로 자동 변환하고 각 요소를 타입 변환합니다.

## 3. 검증 결과
- `npx tsx`를 이용한 고급 단위 테스트 수행 결과, 숫자 및 날짜 자동 감지가 완벽하게 동작함을 확인하였습니다.
- `between` 연산이 두 가지 입력 형식 모두에서 올바른 Prisma 문법을 생성함을 확인하였습니다.

## 4. 기대 효과
- 프론트엔드에서 넘어오는 문자열 형태의 쿼리 파라미터를 백엔드에서 번거롭게 수동 변환할 필요가 없어 생산성이 향상됩니다.
- 데이터 타입 불일치로 인한 Prisma 런타임 오류를 사전에 방지할 수 있습니다.
