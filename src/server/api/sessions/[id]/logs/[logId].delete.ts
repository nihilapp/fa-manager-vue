import {
  BaseResponse,
  ListData,
  RESPONSE_CODE,
  RESPONSE_MESSAGE,
  and,
  authHelper,
  between,
  buildDrizzleWhere,
  campaignMembersTable,
  campaignsTable,
  characterClassesTable,
  charactersTable,
  count,
  currencyTransactionsTable,
  db,
  defineEventHandler,
  desc,
  docsTable,
  eq,
  getQuery,
  getRouterParam,
  getTableColumns,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  logHistoriesTable,
  lt,
  lte,
  ne,
  notBetween,
  notInArray,
  or,
  readBody,
  resolveCommonMetaUpdate,
  sessionLogsTable,
  sessionPlayersTable,
  sessionsTable,
  sortHelper,
  sql,
  usersTable,
} from '@server/runtime';
export default defineEventHandler(async (event) => {
  const sessionId = Number(getRouterParam(event, 'id'));
  const logId = Number(getRouterParam(event, 'logId'));

  if (!Number.isFinite(sessionId) || !Number.isFinite(logId)) {
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

  await db.update(sessionLogsTable)
    .set({
      useYn: 'N',
      deleteYn: 'Y',
      updaterId: user.id,
      updateDate: new Date(),
      deleterId: user.id,
      deleteDate: new Date(),
    })
    .where(eq(sessionLogsTable.id, logId));

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_SESSION_LOG_SUCCESS);
});
