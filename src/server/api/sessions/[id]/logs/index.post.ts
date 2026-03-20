export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const body = await readBody<SessionLogCreateDto>(event);

  if (!Number.isFinite(sessionId) || !body?.title) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const { user, isAdmin, hasPermission, error, } = await authHelper(event);
  if (error) return error;

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

  const sessionPlayer = await db.query.sessionPlayersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.sessionId, sessionId),
      eq(table.userId, user.id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!sessionPlayer && !hasPermission(session.campaign?.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.SESSION_LOG_FORBIDDEN);
  }

  const targetUserId = isAdmin
    ? (body.userId || user.id)
    : user.id;

  const [ sessionLog, ] = await db.insert(sessionLogsTable).values({
    sessionId,
    userId: targetUserId,
    title: body.title,
    content: body.content,
    fileUrl: body.fileUrl,
    creatorId: user.id,
    updaterId: user.id,
    createDate: new Date(),
    updateDate: new Date(),
  }).returning();

  const result = await db.query.sessionLogsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, sessionLog!.id),
    with: {
      session: true,
      user: true,
    },
  });

  return BaseResponse.data(
    result as SessionLogOutDto,
    RESPONSE_CODE.CREATED,
    RESPONSE_MESSAGE.CREATE_SESSION_LOG_SUCCESS
  );
});
