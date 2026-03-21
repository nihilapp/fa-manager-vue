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
  const className = getRouterParam(event, 'className');
  const body = await readBody<CharacterClassUpdateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 필수값 확인
  if (!body || body.level === undefined) {
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

  // 4. 클래스 수정
  const [ updatedClass, ] = await db.update(characterClassesTable)
    .set({
      level: body.level,
    })
    .where(and(
      eq(characterClassesTable.characterId, characterId),
      eq(characterClassesTable.className, className!)
    ))
    .returning();

  if (!updatedClass) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_CLASS_NOT_FOUND);
  }

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(updatedClass, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_CHARACTER_CLASS_SUCCESS);
});
