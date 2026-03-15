export default defineEventHandler(async (event) => {
  const characterId = Number(getRouterParam(event, 'id'));
  const className = getRouterParam(event, 'className');
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<CharacterClassInDto>(event);

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

  // 3. 클래스 수정
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

  return BaseResponse.data(updatedClass, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_CHARACTER_CLASS_SUCCESS);
});
