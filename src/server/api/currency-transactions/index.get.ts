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
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const query = getQuery<CurrencyTransactionQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========
  const columns = getTableColumns(currencyTransactionsTable);
  const where = buildDrizzleWhere<CurrencyTransactionQueryDto>(query, {
    id: 'eq',
    idList: 'in',
    userId: 'eq',
    characterId: 'eq',
    transactionType: 'eq',
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
    .from(currencyTransactionsTable);
  const totalElements = totalRes[0]?.count ?? 0;

  const filteredRes = await db
    .select({ count: count(), })
    .from(currencyTransactionsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.currencyTransactionsTable.findMany({
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
      character: true,
    },
  });

  const listData = new ListData<CurrencyTransactionOutDto>(
    list as CurrencyTransactionOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : null,
    isPaged
      ? size
      : null
  );

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CURRENCY_TRANSACTION_LIST_SUCCESS);
});

