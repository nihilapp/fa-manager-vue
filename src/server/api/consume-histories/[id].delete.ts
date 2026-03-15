export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const discordId = event.req.headers.get('X-Discord-ID');

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

  // 3. 소프트 삭제 실행
  await db.update(consumeHistoriesTable)
    .set({
      useYn: 'N',
      deleteYn: 'Y',
      updaterId: user!.id,
      updateDate: new Date(),
      deleterId: user!.id,
      deleteDate: new Date(),
    })
    .where(eq(consumeHistoriesTable.id, id));

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.OK);
});
