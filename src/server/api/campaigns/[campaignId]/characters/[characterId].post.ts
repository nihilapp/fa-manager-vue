export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  // const query = getQuery<{ name: string }>(event);

  // 2. 패스 파라미터: URL 경로에 정의된 특정 파라미터 값을 가져옵니다. (기본 string | undefined)
  const campaignId = getRouterParam(event, 'campaignId');
  const characterId = getRouterParam(event, 'characterId');

  // 3. 패스 파라미터 객체: 전체 파라미터를 객체 형태로 가져옵니다.
  // const params = getRouterParams(event) as { id: string };

  // 4. 전체 헤더: 요청에 포함된 모든 헤더를 객체로 가져옵니다.
  // const headers = Object.fromEntries(event.req.headers.entries());

  // 6. 쿠키: 모든 쿠키를 파싱하여 객체로 반환합니다.
  // const cookies = parseCookies(event);

  // 7. 요청 바디: POST/PUT 요청의 본문을 가져오며, 제네릭으로 타이핑합니다.
  // const body = await readBody<{ title: string }>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 캠페인 조회 및 권한 확인
  const campaign = await db.query.campaignsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, Number(campaignId)),
  });

  if (!campaign) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CAMPAIGN_NOT_FOUND);
  }

  if (!hasPermission(campaign.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.USER_FORBIDDEN);
  }

  // 캐릭터의 campaignId 업데이트
  const result = await db.update(charactersTable).set({
    campaignId: Number(campaignId),
    updaterId: user!.id,
    updateDate: new Date(),
  }).where(
    eq(charactersTable.id, Number(characterId))
  ).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  // 단건이면
  return BaseResponse.data(result[0] as CharacterOutDto, RESPONSE_CODE.OK, RESPONSE_MESSAGE.CHARACTER_REGISTERED);

  // 다건이면
  // return BaseResponse.page();

  // 실패면
  // return BaseResponse.error();
});
