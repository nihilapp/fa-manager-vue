export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const targetUserId = Number(getRouterParam(event, 'userId'));
  const discordId = event.req.headers.get('X-Discord-ID');

  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  const { user, isAdmin, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 세션 및 캠페인 권한 확인
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

  // 권한 확인: 캠페인 마스터이거나, 관리자이거나, 본인의 참여를 취소하는 경우만 허용
  const isMaster = session.campaign?.userId === user!.id;
  const isSelf = targetUserId === user!.id;

  if (!isAdmin && !isMaster && !isSelf) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  // 3. 참여 기록 삭제 (하드 삭제)
  await db.delete(sessionPlayersTable)
    .where(and(
      eq(sessionPlayersTable.sessionId, sessionId),
      eq(sessionPlayersTable.userId, targetUserId)
    ));

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.PLAYER_DELETED);
});
