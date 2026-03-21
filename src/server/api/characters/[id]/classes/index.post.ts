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
  const characterId = Number(getRouterParam(event, 'id'));
  const body = await readBody<CharacterClassCreateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 필수값 확인
  if (!body || !body.className) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 2. 권한 확인 (X-Discord-ID 헤더 체크 및 유저 검증 포함)
  const { hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 3. 캐릭터 소유권 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, characterId),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  if (!hasPermission(character.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  // 4. 클래스 추가
  const [ characterClass, ] = await db.insert(characterClassesTable).values({
    characterId,
    className: body.className,
    level: body.level || 1,
  }).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(characterClass, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_CHARACTER_CLASS_SUCCESS);
});
