export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const query = getQuery<UserQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. Where 조건 구성
  const userColumns = getTableColumns(usersTable);
  const where = buildDrizzleWhere<UserQueryDto>(query, {
    id: 'eq',
    idList: 'in',
    name: 'like',
    email: 'like',
    role: 'eq',
    useYn: 'eq',
    deleteYn: 'eq',
    discordId: 'eq',
  }, userColumns);

  // 2. 전체 데이터 개수 (Total)
  const totalRes = await db
    .select({ count: count(), })
    .from(usersTable);
  const totalElements = totalRes[0]?.count ?? 0;

  // 3. 필터링된 데이터 개수 (Filtered)
  const filteredRes = await db
    .select({ count: count(), })
    .from(usersTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  // 4. 목록 조회 (Paging & Sorting)
  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const users = await db.query.usersTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', userColumns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      campaigns: true,
      campaignMembers: true,
      characters: true,
      sessionPlayers: true,
      sessionLogs: true,
      docs: true,
      logHistories: true,
    },
  });

  // 5. 결과 반환
  const listData = new ListData<UserOutDto>(
    users as UserOutDto[],
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
  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_USER_LIST_SUCCESS);
});
