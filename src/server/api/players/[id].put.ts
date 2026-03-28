export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = getRouterParam(event, 'id');
  const body = await readBody<PlayerUpdateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const { user, isAdmin, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 1. 사용자 존재 확인
  const findUser = await db.query.playersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, Number(id)),
  });

  if (!findUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  // 2. 권한 확인 (본인이거나 관리자)
  if (!hasPermission(findUser.id)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.UPDATE_PLAYER_FORBIDDEN);
  }

  // 3. 이름 변경 시 중복 체크
  if (body.name && body.name !== findUser.name) {
    const existName = await db
      .select({ value: count(), })
      .from(playersTable)
      .where(
        and(
          eq(playersTable.name, body.name),
          ne(playersTable.id, Number(id))
        )
      );

    if (existName[0]!.value > 0) {
      return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.PLAYER_NAME_ALREADY_EXISTS);
    }
  }

  // 3. 업데이트 실행 (email, discordId 제외)
  const updateUser = await db.update(playersTable).set({
    name: body.name || findUser.name,
    role: isAdmin
      ? (body.role || findUser.role)
      : findUser.role, // 관리자만 권한 변경 가능
    status: isAdmin
      ? (body.status || findUser.status)
      : findUser.status,
    ...resolveCommonMetaUpdate(body, findUser as unknown as CommonOutDto, user!.id),
  }).where(
    eq(playersTable.id, Number(id))
  ).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(updateUser[0], RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_PLAYER_SUCCESS);
});
