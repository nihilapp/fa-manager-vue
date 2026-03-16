export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const characterId = Number(getRouterParam(event, 'id'));
  const className = getRouterParam(event, 'className');

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 권한 확인 (X-Discord-ID 헤더 체크 및 유저 검증 포함)
  const { hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 캐릭터 소유권 확인
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

  // 3. 클래스 삭제 (하드 삭제)
  await db.delete(characterClassesTable)
    .where(and(
      eq(characterClassesTable.characterId, characterId),
      eq(characterClassesTable.className, className!)
    ));

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_CHARACTER_CLASS_SUCCESS);
});
