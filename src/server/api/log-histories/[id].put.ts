export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody<LogHistoryUpdateDto>(event);

  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const { user, isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.LOG_ADMIN_ONLY);
  }

  const logHistory = await db.query.logHistoriesTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!logHistory) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.LOG_NOT_FOUND);
  }

  const hasTableName = Object.prototype.hasOwnProperty.call(body, 'tableName');
  const hasTargetId = Object.prototype.hasOwnProperty.call(body, 'targetId');
  const hasActionType = Object.prototype.hasOwnProperty.call(body, 'actionType');
  const hasOldData = Object.prototype.hasOwnProperty.call(body, 'oldData');
  const hasNewData = Object.prototype.hasOwnProperty.call(body, 'newData');
  const hasDescription = Object.prototype.hasOwnProperty.call(body, 'description');

  const [ updatedLogHistory, ] = await db.update(logHistoriesTable)
    .set({
      tableName: hasTableName
        ? body.tableName
        : logHistory.tableName,
      targetId: hasTargetId
        ? body.targetId
        : logHistory.targetId,
      actionType: hasActionType
        ? body.actionType
        : logHistory.actionType,
      oldData: hasOldData
        ? body.oldData
        : logHistory.oldData,
      newData: hasNewData
        ? body.newData
        : logHistory.newData,
      description: hasDescription
        ? body.description
        : logHistory.description,
      ...resolveCommonMetaUpdate(body, logHistory as unknown as CommonOutDto, user!.id),
    })
    .where(eq(logHistoriesTable.id, id))
    .returning();

  const result = await db.query.logHistoriesTable.findFirst({
    where: (table, { eq, }) => eq(table.id, updatedLogHistory!.id),
    with: {
      user: true,
    },
  });

  return BaseResponse.data(
    result as LogHistoryOutDto,
    RESPONSE_CODE.OK,
    RESPONSE_MESSAGE.UPDATE_LOG_SUCCESS
  );
});
