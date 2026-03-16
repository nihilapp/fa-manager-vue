export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const body = await readBody<UserCreateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  if (!body || !body.discordId) {
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

  const existDiscordId = await db
    .select({ value: count(), })
    .from(usersTable)
    .where(
      eq(usersTable.discordId, body.discordId)
    );

  if (existDiscordId[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.DISCORD_ID_ALREADY_EXISTS);
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
    discordId: body.discordId,
    name: body.name,
    email: body.email,
    role: body.role || 'ROLE_USER',
    creatorId: body.creatorId || null,
  }).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(newUser[0], RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_USER_SUCCESS);
});
