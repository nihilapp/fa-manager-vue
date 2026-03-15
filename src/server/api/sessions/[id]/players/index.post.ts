export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<SessionPlayerInDto>(event);

  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 세션 존재 여부 및 캠페인 마스터 권한 확인
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

  if (!hasPermission(session.campaign?.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  // 3. 이미 등록된 플레이어인지 확인
  const existingPlayer = await db.query.sessionPlayersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.sessionId, sessionId),
      eq(table.characterId, body.characterId!)
    ),
  });

  if (existingPlayer) {
    return BaseResponse.error(RESPONSE_CODE.CONFLICT, RESPONSE_MESSAGE.PLAYER_ALREADY_EXISTS);
  }

  // 4. 캐릭터 소유자 ID 조회 (세션 플레이어 정보에 캐릭터의 유저 ID 기록)
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, body.characterId!),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  // 5. 플레이어 등록
  const [ sessionPlayer, ] = await db.insert(sessionPlayersTable).values({
    sessionId,
    characterId: body.characterId!,
    userId: character.userId, // 캐릭터를 소유한 유저의 ID
    role: 'PLAYER',
    creatorId: user!.id,
  }).returning();

  return BaseResponse.data(sessionPlayer, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.PLAYER_REGISTERED);
});
