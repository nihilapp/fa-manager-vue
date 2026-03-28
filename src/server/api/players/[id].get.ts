export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = getRouterParam(event, 'id');

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const user = await db.query.playersTable.findFirst({
    where: (playersTable, { eq, }) => eq(playersTable.id, Number(id)),
    with: {
      campaigns: true,
      campaignMembers: true,
      characters: true,
      sessionPlayers: true,
      sessionLogs: true,
      docs: true,
      logHistories: true,
    },
  });

  if (!user) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(user, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_PLAYER_DETAIL_SUCCESS);
});
