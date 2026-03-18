export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const targetUserId = Number(getRouterParam(event, 'userId'));

  const { user, hasPermission, error, } = await authHelper(event);
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

  if (!session || !session.campaign) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_NOT_FOUND);
  }

  // 본인 제거이거나, 관리자이거나, 캠페인 마스터인 경우 허용
  if (!hasPermission(targetUserId) && !hasPermission(session.campaign.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  // 3. 참여 기록 삭제 (하드 삭제)
  await db.delete(sessionPlayersTable)
    .where(and(
      eq(sessionPlayersTable.sessionId, sessionId),
      eq(sessionPlayersTable.userId, targetUserId) // 요청자 ID가 아닌 대상 유저 ID 사용
    ));

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.PLAYER_DELETED);
});
