import { Prisma } from '@prisma/client';

/**
 * Prisma `orderBy` 절에서 사용할 정렬 조건을 파싱합니다.
 * @param sortStr - 'column:asc,column:desc' 형태의 문자열
 * @param validColumns - 허용되는 컬럼명의 배열이나 객체 키 사용 (검증용)
 *                       예: ['createdDate', 'name']
 * @param defaultSort - 정렬 조건이 없을 때 사용할 기본 조건 객체/배열
 * @returns Prisma orderBy에 사용할 객체 배열
 */
export const parseSort = (
  sortStr: string | undefined,
  validColumns: string[],
  defaultSort: Record<string, Prisma.SortOrder>[] = []
): Record<string, Prisma.SortOrder>[] => {
  if (!sortStr) {
    return defaultSort;
  }

  const sortConditions = sortStr.split(',').map((s) => s.trim());
  const result: Record<string, Prisma.SortOrder>[] = [];

  for (const condition of sortConditions) {
    const [ column, order, ] = condition.split(':');

    // 검증된 컬럼인지 확인
    if (column && validColumns.includes(column)) {
      const direction: Prisma.SortOrder = order?.toLowerCase() === 'desc'
        ? 'desc'
        : 'asc';
      result.push({ [column]: direction, });
    }
  }

  // 유효한 정렬 조건이 있으면 반환, 없으면 기본값 반환
  return result.length > 0
    ? result
    : defaultSort;
};
