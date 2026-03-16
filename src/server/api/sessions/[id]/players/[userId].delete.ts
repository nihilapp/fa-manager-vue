export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const targetUserId = Number(getRouterParam(event, 'userId'));

  const { user, error, } = await authHelper(event);
  if (error) return error;

  if (!Number.isFinite(sessionId) || !Number.isFinite(targetUserId)) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

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

  if (targetUserId !== user.id) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  // 3. 참여 기록 삭제 (하드 삭제)
  await db.delete(sessionPlayersTable)
    .where(and(
      eq(sessionPlayersTable.sessionId, sessionId),
      eq(sessionPlayersTable.userId, user.id)
    ));

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.PLAYER_DELETED);
});
