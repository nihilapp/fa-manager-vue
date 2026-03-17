export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const discordId = getDiscordId(event);

  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID);
  }

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 세션 및 캠페인 마스터 권한 확인
  const session = await db.query.sessionsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
    with: {
      campaign: true,
    },
  });

  if (!session) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.SESSION_NOT_FOUND);
  }

  if (!hasPermission(session.campaign?.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.SESSION_FORBIDDEN);
  }

  // 3. 세션 소프트 삭제
  await db.update(sessionsTable)
    .set({
      useYn: 'N',
      deleteYn: 'Y',
      updaterId: user!.id,
      updateDate: new Date(),
      deleterId: user!.id,
      deleteDate: new Date(),
    })
    .where(eq(sessionsTable.id, id));

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_SESSION_SUCCESS);
});
