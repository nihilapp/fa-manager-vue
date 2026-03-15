export default defineEventHandler(async (event) => {
  const characterId = Number(getRouterParam(event, 'id'));
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<CharacterClassInDto>(event);

  const { user, hasPermission, error, } = await authHelper(event);
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

  // 3. 클래스 추가
  const [ characterClass, ] = await db.insert(characterClassesTable).values({
    characterId,
    className: body.className!,
    level: body.level || 1,
  }).returning();

  return BaseResponse.data(characterClass, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_CHARACTER_CLASS_SUCCESS);
});
