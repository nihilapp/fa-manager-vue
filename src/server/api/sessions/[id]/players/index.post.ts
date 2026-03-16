export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const body = await readBody<SessionPlayerCreateDto>(event);

  const { user, error, } = await authHelper(event);
  if (error) return error;

  if (!Number.isFinite(sessionId) || !body?.characterId) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 2. 세션 존재 여부 확인
  const session = await db.query.sessionsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, sessionId),
      eq(table.deleteYn, 'N')
    ),
    with: {
      campaign: true,
    },
  });

  if (!session) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_NOT_FOUND);
  }

  // 3. 캐릭터 소유자 및 캠페인 일치 여부 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, body.characterId),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  if (character.userId !== user.id) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  if (character.campaignId !== session.campaignId) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  // 4. 플레이어 등록
  const [ sessionPlayer, ] = await db.insert(sessionPlayersTable).values({
    sessionId,
    characterId: body.characterId,
    userId: user.id,
    role: 'PLAYER',
    creatorId: user!.id,
    updaterId: user!.id,
    createDate: new Date(),
    updateDate: new Date(),
  }).onConflictDoNothing({
    target: [
      sessionPlayersTable.sessionId,
      sessionPlayersTable.userId,
    ],
  }).returning();

  if (sessionPlayer) {
    return BaseResponse.data(sessionPlayer, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.PLAYER_REGISTERED);
  }

  const existingPlayer = await db.query.sessionPlayersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.sessionId, sessionId),
      eq(table.userId, user.id)
    ),
  });

  if (!existingPlayer) {
    return BaseResponse.error(RESPONSE_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
  }

  return BaseResponse.data(existingPlayer, RESPONSE_CODE.OK, RESPONSE_MESSAGE.SESSION_PLAYER_ALREADY_REGISTERED);
});
