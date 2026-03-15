export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  const query = getQuery<SessionInDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. Where 조건 구성
  const columns = getTableColumns(sessionsTable);
  const where = buildDrizzleWhere<SessionInDto>(query, {
    id: 'eq',
    idList: 'in',
    campaignId: 'eq',
    status: 'dynamic',
    name: 'like',
    useYn: 'eq',
    deleteYn: 'eq',
  }, columns);

  // 2. 전체 데이터 개수 (Total)
  const totalRes = await db
    .select({ count: count(), })
    .from(sessionsTable);
  const totalElements = totalRes[0]?.count ?? 0;

  // 3. 필터링된 데이터 개수 (Filtered)
  const filteredRes = await db
    .select({ count: count(), })
    .from(sessionsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  // 4. 목록 조회 (Paging & Sorting)
  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.sessionsTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      campaign: true,
      players: {
        with: {
          character: true,
          user: true,
        },
      },
    },
  });

  // 5. 결과 반환
  const listData = new ListData<SessionOutDto>(
    list as SessionOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : null,
    isPaged
      ? size
      : null
  );

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_SESSION_LIST_SUCCESS);
});
