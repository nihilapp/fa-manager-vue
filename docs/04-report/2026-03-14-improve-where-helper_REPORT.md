# PDCA Report: Where Helper Improvement

- **Date:** 2026-03-14
- **Feature:** improve-where-helper
- **Status:** ✅ Completed (Gap Analysis: 100%)

## 1. 개요
- Prisma `where` 절 생성을 위한 `where.helper.ts`를 고도화하였습니다.
- 논리 연산자(AND/OR) 결합 방식을 지원하여 복합 검색 조건을 유연하게 생성할 수 있게 되었습니다.

## 2. 변경 내역
- **함수명 변경**: `whereBuilder` -> `buildPrismaWhere` (하위 호환성을 위해 기존 명칭은 `Deprecated` 처리 후 별칭으로 유지)
- **논리 연산자 지원**: 세 번째 인자로 `relation` ('AND' | 'OR')을 받아 조건 결합 방식을 결정합니다. (기본값: 'AND')
- **반환값 추가**: 기존에 누락되었던 `return` 구문을 추가하여 완성된 `WhereInput` 객체를 반환합니다.
- **OR 배열 구조 구현**: `relation`이 'OR'일 경우 Prisma의 `OR` 배열 형태(`{ OR: [...] }`)로 조건을 구성합니다.
- **필터 옵션 대폭 확장**: 다음과 같은 다양한 검색 옵션을 추가하였습니다.
  - `eq`: 일치 (equal)
  - `not`: 불일치 (not equal)
  - `like`: 포함 (contains, insensitive)
  - `sw`: 시작 문자열 (startsWith, insensitive)
  - `ew`: 끝 문자열 (endsWith, insensitive)
  - `gt` / `lt`: 초과 / 미만 (greater than / less than)
  - `gte` / `lte`: 이상 / 이하 (greater than or equal / less than or equal)
  - `in`: 배열 포함 (in)

## 3. 검증 결과
- `npx tsx`를 이용한 단위 테스트 스크립트 실행 완료.
- `AND` 연산 시 단일 객체 평탄화 확인.
- `OR` 연산 시 배열 기반 구조화 확인.
- 빈 쿼리 및 부분 쿼리에 대한 예외 처리 확인.

## 4. 향후 권장 사항
- 프로젝트 내 모든 `whereBuilder` 호출부를 `buildPrismaWhere`로 점진적으로 교체할 것을 권장합니다.
- 향후 `NOT` 연산자나 더 복잡한 중첩 쿼리 요구사항이 생길 경우 추가 확장이 가능합니다.
