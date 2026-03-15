export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
  // ========== ========== ========== ==========
  const query = getQuery<ConsumeHistoryInDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. Where 조건 구성
  const columns = getTableColumns(consumeHistoriesTable);
  const where = buildDrizzleWhere<ConsumeHistoryInDto>(query, {
    id: 'eq',
    idList: 'in',
    userId: 'eq',
    characterId: 'eq',
    useYn: 'eq',
    deleteYn: 'eq',
    createDate: 'dynamic',
  }, columns);

  // 2. 전체 데이터 개수 (Total)
  const totalRes = await db
    .select({ count: count(), })
    .from(consumeHistoriesTable);
  const totalElements = totalRes[0]?.count ?? 0;

  // 3. 필터링된 데이터 개수 (Filtered)
  const filteredRes = await db
    .select({ count: count(), })
    .from(consumeHistoriesTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  // 4. 목록 조회 (Paging & Sorting)
  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.consumeHistoriesTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged ? size : undefined,
    offset: isPaged ? page * size : undefined,
    with: {
      user: true,
      character: true,
    },
  });

  // 5. 결과 반환
  const listData = new ListData<ConsumeHistoryOutDto>(
    list as ConsumeHistoryOutDto[],
    totalElements,
    filteredElements,
    isPaged ? page : null,
    isPaged ? size : null
  );

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_LOG_LIST_SUCCESS);
});
