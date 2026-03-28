export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const body = await readBody<PlayerCreateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  if (!body || !body.discordId) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  if (!body || !body.name) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const existDiscordId = await db
    .select({ value: count(), })
    .from(playersTable)
    .where(
      eq(playersTable.discordId, body.discordId)
    );

  if (existDiscordId[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.DISCORD_ID_ALREADY_EXISTS);
  }

  const existName = await db
    .select({ value: count(), })
    .from(playersTable)
    .where(
      eq(playersTable.name, body.name!)
    );

  if (existName[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.PLAYER_NAME_ALREADY_EXISTS);
  }

  const newUser = await db.insert(playersTable).values({
    discordId: body.discordId,
    name: body.name,
    role: 'ROLE_USER', // 강제 적용
    status: body.status || 'ACTIVE',
    creatorId: body.creatorId || null,
    createDate: new Date(),
    updaterId: body.creatorId || null,
    updateDate: new Date(),
  }).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(newUser[0], RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_PLAYER_SUCCESS);
});
