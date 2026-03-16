export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));

  const { isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.LOG_ADMIN_ONLY);
  }

  const logHistory = await db.query.logHistoriesTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
    with: {
      user: true,
    },
  });

  if (!logHistory) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.LOG_NOT_FOUND);
  }

  return BaseResponse.data(
    logHistory as LogHistoryOutDto,
    RESPONSE_CODE.OK,
    RESPONSE_MESSAGE.GET_LOG_DETAIL_SUCCESS
  );
});
