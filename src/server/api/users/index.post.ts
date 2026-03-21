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
  const body = await readBody<UserCreateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  if (!body || !body.discordId) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  if (!body || !body.name) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const existDiscordId = await db
    .select({ value: count(), })
    .from(usersTable)
    .where(
      eq(usersTable.discordId, body.discordId)
    );

  if (existDiscordId[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.DISCORD_ID_ALREADY_EXISTS);
  }

  const existName = await db
    .select({ value: count(), })
    .from(usersTable)
    .where(
      eq(usersTable.name, body.name!)
    );

  if (existName[0]!.value > 0) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.USERNAME_ALREADY_EXISTS);
  }

  const newUser = await db.insert(usersTable).values({
    discordId: body.discordId,
    name: body.name,
    role: 'ROLE_USER', // 강제 적용
    creatorId: body.creatorId || null,
    createDate: new Date(),
    updaterId: body.creatorId || null,
    updateDate: new Date(),
  }).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(newUser[0], RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_USER_SUCCESS);
});

