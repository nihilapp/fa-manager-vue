export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  // const query = getQuery<{ name: string }>(event);

  // 2. 패스 파라미터: URL 경로에 정의된 특정 파라미터 값을 가져옵니다. (기본 string | undefined)
  // const id = getRouterParam(event, 'id');

  // 4. 전체 헤더: 요청에 포함된 모든 헤더를 객체로 가져옵니다.
  // const headers = Object.fromEntries(event.req.headers.entries());

  // 5. 특정 헤더: 특정 헤더 값 하나만 가져옵니다. (대소문자 구분 없음)
  const discordId = event.req.headers.get('X-Discord-ID');

  // 6. 쿠키: 모든 쿠키를 파싱하여 객체로 반환합니다.
  // const cookies = parseCookies(event);

  // 7. 요청 바디: POST/PUT 요청의 본문을 가져오며, 제네릭으로 타이핑합니다.
  const body = await readBody<UserInDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  if (!body || !body.name || !body.email) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const existEmail = await db
    .select({ value: count(), })
    .from(usersTable)
    .where(
      eq(usersTable.email, body.email!)
    );

  if (existEmail[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.EMAIL_ALREADY_EXISTS);
  }

  const existName = await db
    .select({ value: count(), })
    .from(usersTable)
    .where(
      eq(usersTable.name, body.name!)
    );

  if (existName[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.USERNAME_ALREADY_EXISTS);
  }

  const newUser = await db.insert(usersTable).values({
    discordId,
    name: body.name,
    email: body.email,
    role: body.role || 'ROLE_USER',
    creatorId: body.creatorId || null,
  }).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  // 단건이면
  return BaseResponse.data(newUser[0], RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_USER_SUCCESS);

  // 다건이면
  // return BaseResponse.page();

  // 실패면
  // return BaseResponse.error();
});
