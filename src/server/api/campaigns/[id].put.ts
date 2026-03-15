export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  // const query = getQuery<{ name: string }>(event);

  // 2. 패스 파라미터: URL 경로에 정의된 특정 파라미터 값을 가져옵니다. (기본 string | undefined)
  const id = getRouterParam(event, 'id');

  // 3. 패스 파라미터 객체: 전체 파라미터를 객체 형태로 가져옵니다.
  // const params = getRouterParams(event) as { id: string };

  // 4. 전체 헤더: 요청에 포함된 모든 헤더를 객체로 가져옵니다.
  // const headers = Object.fromEntries(event.req.headers.entries());

  // 5. 특정 헤더: 특정 헤더 값 하나만 가져옵니다. (대소문자 구분 없음)
  const discordId = event.req.headers.get('X-Discord-ID');

  // 6. 쿠키: 모든 쿠키를 파싱하여 객체로 반환합니다.
  // const cookies = parseCookies(event);

  // 7. 요청 바디: POST/PUT 요청의 본문을 가져오며, 제네릭으로 타이핑합니다.
  const body = await readBody<CampaignInDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 2. 캠페인 존재 확인
  const findCampaign = await db.query.campaignsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, Number(id)),
  });

  if (!findCampaign) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CAMPAIGN_NOT_FOUND);
  }

  // 3. 권한 확인 (캠페인 마스터이거나 관리자)
  if (!hasPermission(findCampaign.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.USER_FORBIDDEN);
  }

  // 4. 이름 변경 시 중복 체크
  if (body.name && body.name !== findCampaign.name) {
    const existName = await db
      .select({ value: count(), })
      .from(campaignsTable)
      .where(
        and(
          eq(campaignsTable.name, body.name),
          ne(campaignsTable.id, Number(id))
        )
      );

    if (existName[0]!.value > 0) {
      return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.CAMPAIGN_NAME_ALREADY_EXISTS);
    }
  }

  // 4. 업데이트 실행
  const result = await db.update(campaignsTable).set({
    name: body.name || findCampaign.name,
    description: body.description !== undefined
      ? body.description
      : findCampaign.description,
    startDate: body.startDate
      ? new Date(body.startDate)
      : findCampaign.startDate,
    endDate: body.endDate !== undefined
      ? (body.endDate
        ? new Date(body.endDate)
        : null)
      : findCampaign.endDate,
    status: body.status || findCampaign.status,
    useYn: body.useYn || findCampaign.useYn,
    deleteYn: body.deleteYn || findCampaign.deleteYn,
    updaterId: user.id,
    updateDate: new Date(),
  }).where(
    eq(campaignsTable.id, Number(id))
  ).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  // 단건이면
  return BaseResponse.data(result[0] as CampaignOutDto, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_CAMPAIGN_SUCCESS);

  // 다건이면
  // return BaseResponse.page();

  // 실패면
  // return BaseResponse.error();
});
