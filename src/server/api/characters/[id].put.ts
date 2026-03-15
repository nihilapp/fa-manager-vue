export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<CharacterInDto>(event);

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 캐릭터 존재 여부 및 소유권 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  if (!hasPermission(character.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  // 3. 캐릭터 수정
  const [ updatedCharacter, ] = await db.update(charactersTable)
    .set({
      ...body,
      updaterId: user!.id,
      updateDate: new Date(),
    })
    .where(eq(charactersTable.id, id))
    .returning();

  return BaseResponse.data(updatedCharacter, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_CHARACTER_SUCCESS);
});
