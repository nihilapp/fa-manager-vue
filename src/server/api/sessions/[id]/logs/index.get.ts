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
  const query = getQuery<SessionLogQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  if (!Number.isFinite(sessionId)) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

  const session = await db.query.sessionsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, sessionId),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!session) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_NOT_FOUND);
  }

  const columns = getTableColumns(sessionLogsTable);
  const where = and(
    eq(sessionLogsTable.sessionId, sessionId),
    buildDrizzleWhere<SessionLogQueryDto>(query, {
      id: 'eq',
      idList: 'in',
      userId: 'eq',
      title: 'like',
      useYn: 'eq',
      deleteYn: 'eq',
      creatorId: 'eq',
      createDate: 'dynamic',
      updaterId: 'eq',
      updateDate: 'dynamic',
      deleterId: 'eq',
      deleteDate: 'dynamic',
    }, columns)
  );

  const totalRes = await db
    .select({ count: count(), })
    .from(sessionLogsTable)
    .where(eq(sessionLogsTable.sessionId, sessionId));
  const totalElements = totalRes[0]?.count ?? 0;

  const filteredRes = await db
    .select({ count: count(), })
    .from(sessionLogsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.sessionLogsTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      session: true,
      user: true,
    },
  });

  const listData = new ListData<SessionLogOutDto>(
    list as SessionLogOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : null,
    isPaged
      ? size
      : null
  );

  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_SESSION_LOG_LIST_SUCCESS);
});
