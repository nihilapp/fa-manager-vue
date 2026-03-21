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
  const id = Number(getRouterParam(event, 'id'));

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const session = await db.query.sessionsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
    with: {
      campaign: true,
      players: {
        with: {
          character: true,
          user: true,
        },
      },
      logs: {
        with: {
          user: true,
        },
      },
    },
  });

  if (!session) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_NOT_FOUND);
  }

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  return BaseResponse.data(session as SessionOutDto, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_SESSION_DETAIL_SUCCESS);
});
