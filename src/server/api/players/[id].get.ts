export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));

  const { isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseApiResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  if (!Number.isFinite(id)) {
    return BaseApiResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

  const findUser = await db.query.playersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
    with: {
      campaigns: true,
      campaignMembers: true,
      characters: true,
      sessionPlayers: true,
      sessionLogs: true,
      docs: true,
      logHistories: true,
      currencyTransactions: true,
    },
  });

  if (!findUser) {
    return BaseApiResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  return BaseApiResponse.data(findUser, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_PLAYER_DETAIL_SUCCESS);
});
