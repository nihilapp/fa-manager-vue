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
  const body = await readBody<CurrencyTransactionCreateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========
  if (!body || !body.characterId || !body.description) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, body.characterId),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  if (!hasPermission(character.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CURRENCY_TRANSACTION_FORBIDDEN);
  }

  const transactionType = body.transactionType || 'INIT';

  if (transactionType === 'INIT') {
    const initTransaction = await db.query.currencyTransactionsTable.findFirst({
      where: (table, { eq, and, }) => and(
        eq(table.characterId, body.characterId),
        eq(table.transactionType, 'INIT'),
        eq(table.deleteYn, 'N')
      ),
    });

    if (initTransaction) {
      return BaseResponse.error(RESPONSE_CODE.CONFLICT, RESPONSE_MESSAGE.CHARACTER_INIT_TRANSACTION_ALREADY_EXISTS);
    }
  }

  const [ transaction, ] = await db.insert(currencyTransactionsTable).values({
    userId: character.userId,
    characterId: body.characterId,
    transactionType,
    description: body.description,
    deltaPp: body.deltaPp ?? 0,
    deltaGp: body.deltaGp ?? 0,
    deltaEp: body.deltaEp ?? 0,
    deltaSp: body.deltaSp ?? 0,
    deltaCp: body.deltaCp ?? 0,
    creatorId: user!.id,
  }).returning();

  const result = await db.query.currencyTransactionsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, transaction!.id),
    with: {
      user: true,
      character: true,
    },
  });

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(
    result as CurrencyTransactionOutDto,
    RESPONSE_CODE.CREATED,
    RESPONSE_MESSAGE.CREATE_CURRENCY_TRANSACTION_SUCCESS
  );
});

