export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<ConsumeHistoryInDto>(event);

  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 소모 내역 조회 및 권한 확인
  const consumeHistory = await db.query.consumeHistoriesTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!consumeHistory) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.LOG_NOT_FOUND);
  }

  if (!hasPermission(consumeHistory.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.USER_FORBIDDEN);
  }

  // 3. 수정 실행
  const [ updatedHistory, ] = await db.update(consumeHistoriesTable)
    .set({
      ...body,
      updaterId: user!.id,
      updateDate: new Date(),
    })
    .where(eq(consumeHistoriesTable.id, id))
    .returning();

  return BaseResponse.data(updatedHistory, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_USER_SUCCESS); // 로그 수정 전용 메시지가 없어 임시 사용
});
