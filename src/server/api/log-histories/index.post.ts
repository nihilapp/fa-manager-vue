export default defineEventHandler(async (event) => {
  const body = await readBody<LogHistoryCreateDto>(event);

  if (!body?.userId || !body.tableName || !body.targetId || !body.actionType) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const { user, isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.LOG_ADMIN_ONLY);
  }

  const targetUser = await db.query.usersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, body.userId),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!targetUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND);
  }

  const [ logHistory, ] = await db.insert(logHistoriesTable).values({
    userId: body.userId,
    tableName: body.tableName,
    targetId: body.targetId,
    actionType: body.actionType,
    oldData: body.oldData,
    newData: body.newData,
    description: body.description,
    creatorId: user!.id,
    updaterId: user!.id,
  }).returning();

  const result = await db.query.logHistoriesTable.findFirst({
    where: (table, { eq, }) => eq(table.id, logHistory!.id),
    with: {
      user: true,
    },
  });

  return BaseResponse.data(
    result as LogHistoryOutDto,
    RESPONSE_CODE.CREATED,
    RESPONSE_MESSAGE.CREATE_LOG_SUCCESS
  );
});
