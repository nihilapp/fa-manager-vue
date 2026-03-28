export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  const query = getQuery<CampaignQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  // 2. 패스 파라미터: URL 경로에 정의된 특정 파라미터 값을 가져옵니다. (기본 string | undefined)
  // const id = getRouterParam(event, 'id');

  // 3. 패스 파라미터 객체: 전체 파라미터를 객체 형태로 가져옵니다.
  // const params = getRouterParams(event) as { id: string };

  // 4. 전체 헤더: 요청에 포함된 모든 헤더를 객체로 가져옵니다.
  // const headers = Object.fromEntries(event.req.headers.entries());

  // 5. 특정 헤더: 특정 헤더 값 하나만 가져옵니다. (대소문자 구분 없음)
  // const discordId = getDiscordId(event);

  // 6. 쿠키: 모든 쿠키를 파싱하여 객체로 반환합니다.
  // const cookies = parseCookies(event);

  // 7. 요청 바디: POST/PUT 요청의 본문을 가져오며, 제네릭으로 타이핑합니다.
  // const body = await readBody<{ title: string }>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. Where 조건 구성
  const columns = getTableColumns(campaignsTable);
  const where = buildDrizzleWhere<CampaignQueryDto>(query, {
    id: 'eq',
    idList: 'in',
    name: 'like',
    status: 'eq',
    useYn: 'eq',
    deleteYn: 'eq',
    userId: 'eq',
  }, columns);

  // 2. 전체 데이터 개수 (Total)
  const totalRes = await db
    .select({ count: count(), })
    .from(campaignsTable);
  const totalElements = totalRes[0]?.count ?? 0;

  // 3. 필터링된 데이터 개수 (Filtered)
  const filteredRes = await db
    .select({ count: count(), })
    .from(campaignsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  // 4. 목록 조회 (Paging & Sorting)
  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.campaignsTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      user: true,
    },
  });

  // 5. 결과 반환
  const listData = new ListData<CampaignOutDto>(
    list as CampaignOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : 0,
    isPaged
      ? size
      : 0
  );

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  // 단건이면
  // return BaseResponse.data();

  // 다건이면
  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CAMPAIGN_LIST_SUCCESS);

  // 실패면
  // return BaseResponse.error();
});
