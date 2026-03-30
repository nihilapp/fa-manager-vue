export default defineEventHandler(async (event) => {
  const { user, error, isDevelopmentBypass, } = await authHelper(event);

  if (error) {
    return error;
  }

  const findUser = await db.query.playersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, user!.id),
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
    if (isDevelopmentBypass && user) {
      return BaseApiResponse.data(user, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_MY_PLAYER_INFO_SUCCESS);
    }

    return BaseApiResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  return BaseApiResponse.data(findUser, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_MY_PLAYER_INFO_SUCCESS);
});

