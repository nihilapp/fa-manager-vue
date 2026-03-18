export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const body = await readBody<SessionPlayerCreateDto>(event);

  const { user: requester, hasPermission, error, } = await authHelper(event);
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

  if (!session || !session.campaign) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_NOT_FOUND);
  }

  // 3. 캐릭터 소유자 및 캠페인 일치 여부 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, body.characterId),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  // 본인 캐릭터이거나, 관리자이거나, 캠페인 마스터인 경우 허용
  if (!hasPermission(character.userId) && !hasPermission(session.campaign.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  if (character.campaignId !== session.campaignId) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  // 4. 플레이어 등록
  const [ sessionPlayer, ] = await db.insert(sessionPlayersTable).values({
    sessionId,
    characterId: body.characterId,
    userId: character.userId, // 요청자가 아닌 캐릭터 소유자 ID 사용
    role: 'PLAYER',
    creatorId: requester!.id,
    updaterId: requester!.id,
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
      eq(table.userId, character.userId) // 요청자가 아닌 캐릭터 소유자 ID 사용
    ),
  });

  if (!existingPlayer) {
    return BaseResponse.error(RESPONSE_CODE.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);
  }

  return BaseResponse.data(existingPlayer, RESPONSE_CODE.OK, RESPONSE_MESSAGE.SESSION_PLAYER_ALREADY_REGISTERED);
});
