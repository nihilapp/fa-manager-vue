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
  const { user, error, } = await authHelper(event);
  if (error) return error;

  const findUser = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, user!.id),
  });

  if (!findUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND);
  }

  await db.update(usersTable)
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
        eq(usersTable.id, user!.id),
        eq(usersTable.deleteYn, 'N')
      )
    );

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_USER_SUCCESS);
});

