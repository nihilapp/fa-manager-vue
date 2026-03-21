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
  const id = Number(getRouterParam(event, 'id'));

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 권한 확인 (X-Discord-ID 헤더 체크 및 유저 검증 포함)
  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 캐릭터 존재 여부 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  // 3. 소유권 확인
  if (!hasPermission(character.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  // 4. 소프트 삭제 처리
  await db.update(charactersTable)
    .set({
      useYn: 'N',
      deleteYn: 'Y',
      updaterId: user!.id,
      updateDate: new Date(),
      deleterId: user!.id,
      deleteDate: new Date(),
    })
    .where(eq(charactersTable.id, id));

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_CHARACTER_SUCCESS);
});
