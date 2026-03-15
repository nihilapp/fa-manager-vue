# PDCA Plan: Where Helper Improvement

- **Date:** 2026-03-14
- **Feature:** improve-where-helper
- **Goal:** Prisma `where` 절 생성을 위한 `buildPrismaWhere` 유틸리티 강화 (AND/OR 지원)

## 1. 개요
- 기존 `whereBuilder`는 반환값이 없고 논리 연산자(AND/OR)를 지원하지 않음.
- 이를 `buildPrismaWhere`로 개편하여 쿼리 조건 결합 방식(AND 또는 OR)을 선택할 수 있도록 함.

## 2. 주요 개선 사항
- 함수명 변경: `whereBuilder` -> `buildPrismaWhere`
- 논리 연산자 파라미터 추가: `relation: 'AND' | 'OR' = 'AND'`
- 반환값 추가: Prisma에서 바로 사용 가능한 `where` 객체 반환.
- `OR` 연산 시 `[{ key: val1 }, { key: val2 }]` 형태의 배열 구조 생성.

## 3. 작업 목록 (Tasks)
- [ ] `docs/02-design/2026-03-14-improve-where-helper_DESIGN.md` 작성
- [ ] `src/server/utils/where.helper.ts` 수정
- [ ] 수정 사항 검증 (Unit Test 또는 수동 검증)

## 4. 기대 효과
- 복잡한 검색 조건(통합 검색 등)을 유연하게 처리 가능.
- 코드 재사용성 및 가독성 향상.
