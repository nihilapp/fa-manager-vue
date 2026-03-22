export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const logId = Number(getRouterParam(event, 'logId'));
  const body = await readBody<SessionLogUpdateDto>(event);

  if (!Number.isFinite(sessionId) || !Number.isFinite(logId) || !body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

  const { user, isAdmin, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  const sessionLog = await db.query.sessionLogsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, logId),
      eq(table.sessionId, sessionId),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!sessionLog) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_LOG_NOT_FOUND);
  }

  if (!hasPermission(sessionLog.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.SESSION_LOG_FORBIDDEN);
  }

  const [ updatedSessionLog, ] = await db.update(sessionLogsTable)
    .set({
      title: body.title ?? sessionLog.title,
      content: body.content !== undefined
        ? body.content
        : sessionLog.content,
      fileUrl: body.fileUrl !== undefined
        ? body.fileUrl
        : sessionLog.fileUrl,
      ...resolveCommonMetaUpdate(body, sessionLog as unknown as CommonOutDto, user!.id),
    })
    .where(eq(sessionLogsTable.id, logId))
    .returning();

  const result = await db.query.sessionLogsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, updatedSessionLog!.id),
    with: {
      session: true,
      user: true,
    },
  });

  return BaseResponse.data(
    result as SessionLogOutDto,
    RESPONSE_CODE.OK,
    RESPONSE_MESSAGE.UPDATE_SESSION_LOG_SUCCESS
  );
});
