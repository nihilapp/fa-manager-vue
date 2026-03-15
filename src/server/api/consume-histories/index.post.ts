export default defineEventHandler(async (event) => {
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<ConsumeHistoryInDto>(event);

  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 캐릭터 존재 여부 및 소유권 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, body.characterId!),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  if (!hasPermission(character.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  // 3. 소모 내역 생성
  const [ consumeHistory, ] = await db.insert(consumeHistoriesTable).values({
    userId: character.userId, // 캐릭터의 소유주 ID를 기록
    characterId: body.characterId!,
    description: body.description!,
    beforeCurrency: body.beforeCurrency!,
    afterCurrency: body.afterCurrency!,
    creatorId: user!.id,
  }).returning();

  return BaseResponse.data(consumeHistory, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATED);
});
