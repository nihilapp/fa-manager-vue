export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody<CommonInDto & { status: CharacterStatus }>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 필수값 확인
  if (!body || !body.status) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 2. 권한 확인 (X-Discord-ID 헤더 체크 및 유저 검증 포함)
  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 3. 캐릭터 존재 여부 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  // 4. 소유권 확인
  if (!hasPermission(character.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  // 5. 상태 업데이트
  const [ updatedCharacter, ] = await db.update(charactersTable)
    .set({
      status: body.status,
      ...resolveCommonMetaUpdate(body, character as unknown as CommonOutDto, user!.id),
    })
    .where(eq(charactersTable.id, id))
    .returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(
    updatedCharacter,
    RESPONSE_CODE.OK,
    RESPONSE_MESSAGE.CHARACTER_STATUS_UPDATED(String(id), character.status!, body.status)
  );
});
