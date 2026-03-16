export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));

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

  await db.update(logHistoriesTable)
    .set({
      useYn: 'N',
      deleteYn: 'Y',
      updaterId: user!.id,
      updateDate: new Date(),
      deleterId: user!.id,
      deleteDate: new Date(),
    })
    .where(
      and(
        eq(logHistoriesTable.id, id),
        eq(logHistoriesTable.deleteYn, 'N')
      )
    );

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_LOG_SUCCESS);
});
