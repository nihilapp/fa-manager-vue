export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const discordId = event.req.headers.get('X-Discord-ID');

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

  // 3. 소프트 삭제 처리
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

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_CHARACTER_SUCCESS);
});
