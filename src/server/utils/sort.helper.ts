/**
 * Drizzle용 정렬 헬퍼
 * @param sortString "column:asc,column:desc" 형식의 문자열
 * @param tableColumns 테이블의 컬럼 객체 (예: getTableColumns(usersTable))
 */
export function sortHelper(sortString: string, tableColumns: Record<string, PgColumn>) {
  if (!sortString) return [];

  const sortKeys = sortString.split(',');

  return sortKeys.map((item) => {
    const [ columnKey, order, ] = item.split(':');
    const column = tableColumns[columnKey!.trim()];

    if (!column) return null;

    return order?.trim().toLowerCase() === 'desc'
      ? desc(column)
      : asc(column);
  }).filter(Boolean);
}
