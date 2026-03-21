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
  const body = await readBody<SessionCreateDto>(event);

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  if (!body || !body.campaignId || body.no === undefined || !body.name) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 2. 캠페인 조회 및 마스터 권한 확인
  const campaign = await db.query.campaignsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, body.campaignId!),
  });

  if (!campaign) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CAMPAIGN_NOT_FOUND);
  }

  if (!hasPermission(campaign.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.SESSION_FORBIDDEN);
  }

  // 3. 세션 생성
  const [ session, ] = await db.insert(sessionsTable).values({
    campaignId: body.campaignId,
    no: body.no,
    name: body.name,
    description: body.description,
    maxPlayer: body.maxPlayer,
    rewardExp: body.rewardExp,
    rewardGold: body.rewardGold,
    status: body.status,
    playDate: body.playDate
      ? new Date(body.playDate)
      : body.playDate === null
        ? null
        : undefined,
    creatorId: user!.id,
    updaterId: user!.id,
    createDate: new Date(),
    updateDate: new Date(),
  }).returning();

  return BaseResponse.data(session, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_SESSION_SUCCESS);
});

