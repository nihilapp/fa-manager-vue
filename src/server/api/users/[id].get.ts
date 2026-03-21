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
  const id = getRouterParam(event, 'id');

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const user = await db.query.usersTable.findFirst({
    where: (usersTable, { eq, }) => eq(usersTable.id, Number(id)),
    with: {
      campaigns: true,
      campaignMembers: true,
      characters: true,
      sessionPlayers: true,
      sessionLogs: true,
      docs: true,
      logHistories: true,
    },
  });

  if (!user) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND);
  }

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(user, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_USER_DETAIL_SUCCESS);
});
