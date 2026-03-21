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
  const query = getQuery<LogHistoryQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  const { isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.LOG_ADMIN_ONLY);
  }

  const columns = getTableColumns(logHistoriesTable);
  const where = buildDrizzleWhere<LogHistoryQueryDto>(query, {
    id: 'eq',
    idList: 'in',
    userId: 'eq',
    tableName: 'eq',
    targetId: 'eq',
    actionType: 'eq',
    description: 'like',
    useYn: 'eq',
    deleteYn: 'eq',
    creatorId: 'eq',
    createDate: 'dynamic',
    updaterId: 'eq',
    updateDate: 'dynamic',
    deleterId: 'eq',
    deleteDate: 'dynamic',
  }, columns);

  const totalRes = await db
    .select({ count: count(), })
    .from(logHistoriesTable);
  const totalElements = totalRes[0]?.count ?? 0;

  const filteredRes = await db
    .select({ count: count(), })
    .from(logHistoriesTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.logHistoriesTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      user: true,
    },
  });

  const listData = new ListData<LogHistoryOutDto>(
    list as LogHistoryOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : null,
    isPaged
      ? size
      : null
  );

  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_LOG_LIST_SUCCESS);
});

