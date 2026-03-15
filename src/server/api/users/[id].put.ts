export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  // const query = getQuery<{ name: string }>(event);

  // 2. 패스 파라미터: URL 경로에 정의된 특정 파라미터 값을 가져옵니다. (기본 string | undefined)
  const id = getRouterParam(event, 'id');

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

  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 1. 사용자 존재 확인
  const findUser = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, Number(id)),
  });

  if (!findUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND);
  }

  // 2. 이름 변경 시 중복 체크
  if (body.name && body.name !== findUser.name) {
    const existName = await db
      .select({ value: count(), })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.name, body.name),
          ne(usersTable.id, Number(id))
        )
      );

    if (existName[0]!.value > 0) {
      return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.USERNAME_ALREADY_EXISTS);
    }
  }

  // 3. 업데이트 실행 (email, discordId 제외)
  const updateUser = await db.update(usersTable).set({
    name: body.name || findUser.name,
    role: body.role || findUser.role,
    useYn: body.useYn || findUser.useYn,
    deleteYn: body.deleteYn || findUser.deleteYn,
    updaterId: body.updaterId || null,
    updateDate: new Date(),
  }).where(
    eq(usersTable.id, Number(id))
  ).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  // 단건이면
  return BaseResponse.data(updateUser[0], RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_USER_SUCCESS);

  // 다건이면
  // return BaseResponse.page();

  // 실패면
  // return BaseResponse.error();
});
