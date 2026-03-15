# PDCA Design: Where Helper Improvement

## 1. 개요
- `buildPrismaWhere` 유틸리티의 인터페이스 정의 및 논리 연산자(AND/OR) 처리 설계.

## 2. 함수 시그니처
```typescript
export function buildPrismaWhere<Dto extends object>(
  query: Dto,
  map: Partial<Record<keyof Dto, FilterOption>>,
  relation: 'AND' | 'OR' = 'AND'
): any // Prisma.WhereInput (정확한 타입을 위해 any 혹은 Prisma 타입을 적절히 활용)
```

## 3. 상세 설계
### 3.1 조건 생성 로직
- `query` 객체의 키를 순회하며 `map`에 정의된 `FilterOption`에 따라 Prisma 쿼리 객체를 생성합니다.
- 유효하지 않은 값 (`undefined`, `null`, `''`) 또는 `map`에 정의되지 않은 키는 무시합니다.

### 3.2 논리 연산자 결합 (Relation)
- **AND (기본값)**: 생성된 모든 조건을 하나의 객체에 평탄하게(Flat) 결합합니다.
  - 예: `{ role: 'admin', status: 'active' }`
- **OR**: 각 조건을 개별 객체로 분리하여 `OR` 배열에 담습니다.
  - 예: `{ OR: [ { name: { contains: 'abc' } }, { email: { contains: 'abc' } } ] }`

### 3.3 FilterOption 매핑
- `eq`: `where[key] = value`
- `not`: `where[key] = { not: value }`
- `like`: `where[key] = { contains: value, mode: 'insensitive' }`
- `sw`: `where[key] = { startsWith: value, mode: 'insensitive' }`
- `ew`: `where[key] = { endsWith: value, mode: 'insensitive' }`
- `gt`: `where[key] = { gt: value }`
- `lt`: `where[key] = { lt: value }`
- `gte`: `where[key] = { gte: value }`
- `lte`: `where[key] = { lte: value }`
- `in`: `where[key] = { in: Array.isArray(value) ? value : [value] }`

## 4. 구현 가이드
- 기존 `whereBuilder`를 `buildPrismaWhere`로 변경하거나 별칭으로 제공합니다.
- `Prisma.QueryMode.insensitive`를 사용하여 대소문자 구분 없는 검색을 지원합니다.
- 최종적으로 생성된 `where` 객체를 반환(return)하도록 수정합니다.
