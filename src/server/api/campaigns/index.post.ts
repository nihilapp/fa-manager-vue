export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  // const query = getQuery<{ name: string }>(event);

  // 2. 패스 파라미터: URL 경로에 정의된 특정 파라미터 값을 가져옵니다. (기본 string | undefined)
  // const id = getRouterParam(event, 'id');

  // 3. 패스 파라미터 객체: 전체 파라미터를 객체 형태로 가져옵니다.
  // const params = getRouterParams(event) as { id: string };

  // 4. 전체 헤더: 요청에 포함된 모든 헤더를 객체로 가져옵니다.
  // const headers = Object.fromEntries(event.req.headers.entries());

  // 5. 특정 헤더: 특정 헤더 값 하나만 가져옵니다. (대소문자 구분 없음)
  // 6. 쿠키: 모든 쿠키를 파싱하여 객체로 반환합니다.
  // const cookies = parseCookies(event);

  // 7. 요청 바디: POST/PUT 요청의 본문을 가져오며, 제네릭으로 타이핑합니다.
  const body = await readBody<CampaignCreateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const { user, error, } = await authHelper(event);
  if (error) return error;

  if (!body || !body.name || !body.startDate) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 2. 이름 중복 체크
  const existName = await db
    .select({ value: count(), })
    .from(campaignsTable)
    .where(eq(campaignsTable.name, body.name));

  if (existName[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.CAMPAIGN_NAME_ALREADY_EXISTS);
  }

  // 3. 트랜잭션 실행: 캠페인 생성 + 생성자 멤버 등록
  const result = await db.transaction(async (tx) => {
    // 캠페인 생성
    const newCampaign = await tx.insert(campaignsTable).values({
      userId: user!.id,
      name: body.name!,
      description: body.description,
      status: body.status || 'PREPARING',
      startDate: new Date(body.startDate!),
      endDate: body.endDate
        ? new Date(body.endDate)
        : null,
      creatorId: user!.id,
      updaterId: user!.id,
      createDate: new Date(),
      updateDate: new Date(),
    }).returning();

    // 생성자를 MASTER 멤버로 등록
    await tx.insert(campaignMembersTable).values({
      userId: user!.id,
      campaignId: newCampaign[0]!.id,
      role: 'MASTER',
      creatorId: user!.id,
      updaterId: user!.id,
      createDate: new Date(),
      updateDate: new Date(),
    });

    return newCampaign;
  });

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  // 단건이면
  return BaseResponse.data(result as CampaignOutDto, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_CAMPAIGN_SUCCESS);

  // 다건이면
  // return BaseResponse.page();

  // 실패면
  // return BaseResponse.error();
});
