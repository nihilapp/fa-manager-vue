export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const logId = Number(getRouterParam(event, 'logId'));

  if (!Number.isFinite(sessionId) || !Number.isFinite(logId)) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

  const sessionLog = await db.query.sessionLogsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, logId),
      eq(table.sessionId, sessionId),
      eq(table.deleteYn, 'N')
    ),
    with: {
      session: true,
      user: true,
    },
  });

  if (!sessionLog) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_LOG_NOT_FOUND);
  }

  return BaseResponse.data(
    sessionLog as SessionLogOutDto,
    RESPONSE_CODE.OK,
    RESPONSE_MESSAGE.GET_SESSION_LOG_SUCCESS
  );
});
