# [DESIGN] 동적 정렬 파서 설계 (parseSort)

- **작업일**: 2026-03-02
- **작성자**: Gemini CLI

## 1. 🛠️ 인터페이스 정의

```typescript
/**
 * @param sortStr - 'name:asc,createdDate:desc' 형태의 문자열
 * @param table - Drizzle orderBy 콜백의 첫 번째 인자 (columns 객체)
 * @param operators - { asc, desc } Drizzle 연산자
 * @param defaultSort - 정렬 조건이 없을 때 사용할 기본 SQL 조건 배열
 * @returns SQL[] - Drizzle orderBy에 전달할 조건 배열
 */
export const parseSort = (
  sortStr: string | undefined,
  table: any,
  operators: { asc: any; desc: any },
  defaultSort: any[] = [ operators.desc(table.createdDate), ]
): any[] => {
  // 구현 로직...
}
```

## 2. 📝 상세 로직 설계
1.  `sortStr`이 없으면 `defaultSort`를 즉시 반환한다.
2.  문자열을 쉼표(`,`)로 분할하여 배열로 만든다.
3.  각 정렬 항목에 대해 콜론(`:`)으로 나누어 컬럼과 방향을 추출한다.
4.  `table[column]`이 실제 존재하는지 확인한다.
5.  방향이 `asc`이면 `operators.asc()`, 아니면 `operators.desc()`를 사용하여 `SQL` 객체를 생성한다.
6.  성공적으로 파싱된 조건이 하나라도 있으면 이를 반환하고, 없으면 `defaultSort`를 반환한다.

## 3. 🚀 적용 예시

```typescript
// index.get.ts 내부에서
db.query.users.findMany({
  where: whereCondition,
  orderBy: (users, { asc, desc, }) => parseSort(query.sort, users, { asc, desc, }),
  limit: size,
  offset,
})
```

## 4. ✅ 검증 포인트
- `createdDate`가 없는 테이블이 있을 경우 `defaultSort`에서 에러가 날 수 있으므로 주의 (이 프로젝트의 모든 테이블은 `defaultColumns`를 공유하므로 안전함).
- 잘못된 컬럼명을 보냈을 때 무시되고 기본 정렬이 작동하는지 확인.
