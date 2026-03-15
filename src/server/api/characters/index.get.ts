export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  const query = getQuery<CharacterInDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  // 2. 패스 파라미터: URL 경로에 정의된 특정 파라미터 값을 가져옵니다. (기본 string | undefined)
  // const id = getRouterParam(event, 'id');

  // 4. 전체 헤더: 요청에 포함된 모든 헤더를 객체로 가져옵니다.
  // const headers = Object.fromEntries(event.req.headers.entries());

  // 5. 특정 헤더: 특정 헤더 값 하나만 가져옵니다. (대소문자 구분 없음)
  // const discordId = event.req.headers.get('X-Discord-ID');

  // 6. 쿠키: 모든 쿠키를 파싱하여 객체로 반환합니다.
  // const cookies = parseCookies(event);

  // 7. 요청 바디: POST/PUT 요청의 본문을 가져오며, 제네릭으로 타이핑합니다.
  // const body = await readBody<{ title: string }>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const columns = getTableColumns(charactersTable);
  const where = buildDrizzleWhere<CharacterInDto>(query, {
    id: 'eq',
    idList: 'in',
    userId: 'eq',
    campaignId: 'eq',
    name: 'like',
    status: 'eq',
    race: 'like',
    currentLevel: 'dynamic',
    str: 'dynamic',
    dex: 'dynamic',
    con: 'dynamic',
    int: 'dynamic',
    wis: 'dynamic',
    cha: 'dynamic',
    ac: 'dynamic',
    hp: 'dynamic',
    speed: 'like',
    vision: 'like',
    skills: 'like',
    advantage: 'like',
    disadvantage: 'like',
    resistance: 'like',
    immunity: 'like',
    useYn: 'eq',
    deleteYn: 'eq',
  }, columns);

  const total = await db
    .select({ count: count(), })
    .from(charactersTable);

  const filtered = await db
    .select({ count: count(), })
    .from(charactersTable)
    .where(where);

  const totalElements = total[0]!.count;
  const filteredElements = filtered[0]!.count;

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.charactersTable.findMany({
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
      campaign: true,
      classes: true,
      sessions: true,
      consumeHistories: true,
    },
  });

  const listData = new ListData<CharacterOutDto>(
    (list as any[]).map((character) => {
      const classes = character.classes || [];
      const sessions = character.sessions || [];
      const consumes = character.consumeHistories || [];

      // 동적 필드 계산
      const currentLevel = classes.reduce((acc: number, curr: any) => acc + (curr.level || 0), 0) || character.startLevel || 1;
      const sessionExp = sessions.reduce((acc: number, curr: any) => acc + (curr.session?.rewardExp || 0), 0);
      const sessionGold = sessions.reduce((acc: number, curr: any) => acc + (curr.session?.rewardGold || 0), 0);
      const consumeGold = consumes.reduce((acc: number, curr: any) => acc + ((curr.beforeCurrency as any).gp - (curr.afterCurrency as any).gp), 0);

      return {
        ...character,
        currentLevel,
        currentExp: (character.startExp || 0) + sessionExp,
        currentCurrencyGp: (character.startCurrencyGp || 0) + sessionGold - consumeGold,
        currentCurrencyCp: character.startCurrencyCp,
        currentCurrencySp: character.startCurrencySp,
        currentCurrencyEp: character.startCurrencyEp,
        currentCurrencyPp: character.startCurrencyPp,
      } as CharacterOutDto;
    }),
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

  // 단건이면
  // return BaseResponse.data();

  // 다건이면
  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CHARACTER_LIST_SUCCESS);

  // 실패면
  // return BaseResponse.error();
});
