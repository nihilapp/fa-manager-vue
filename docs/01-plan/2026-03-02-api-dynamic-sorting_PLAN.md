# [PLAN] API 동적 정렬 구현 (Dynamic Sorting)

- **작업일**: 2026-03-02
- **작성자**: Gemini CLI
- **목표**: 모든 목록 조회 API(`index.get.ts`)에서 `CommonInDto.sort` 파라미터를 파싱하여 동적으로 `orderBy`를 적용한다.

## 1. 📋 요구사항 분석
- `CommonInDto`에 정의된 `sort` 필드는 `column:asc` 또는 `column:desc` 형식을 가진다. (쉼표로 구분하여 다중 정렬 가능)
- 현재 모든 목록 조회 API는 `desc(table.createdDate)`가 하드코딩되어 있다.
- `sort` 파라미터가 제공되면 이를 파싱하여 우선 적용하고, 유효하지 않거나 없으면 기본값인 `createdDate:desc`를 적용한다.
- Drizzle ORM의 `db.query` 방식을 지원해야 한다.

## 2. 🛠️ 작업 목록 (PDCA)

### [Plan]
- [x] 정렬 파싱 로직 설계
- [ ] 공통 유틸리티(`server/utils/parse-sort.ts`) 작성

### [Design]
- [ ] 파서 인터페이스 정의: `parseSort(sortStr, table, operators)`

### [Do]
- [ ] `server/api/users/index.get.ts` 적용 및 검증
- [ ] 나머지 모든 `index.get.ts` 파일(총 8개) 일괄 수정

### [Check/Act]
- [ ] 전체 기능 작동 여부 확인 (Gap Analysis)
- [ ] 완료 보고서 작성

## 3. 🎯 기대 결과
- 클라이언트에서 `?sort=name:asc` 처럼 요청을 보내면 원하는 순서로 데이터를 받을 수 있다.
- 코드 중복을 최소화하고 일관된 정렬 정책을 유지할 수 있다.
