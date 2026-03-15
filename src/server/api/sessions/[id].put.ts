export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const discordId = event.req.headers.get('X-Discord-ID');
  const body = await readBody<SessionInDto>(event);

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

  // 3. 세션 업데이트
  const [ updatedSession, ] = await db.update(sessionsTable)
    .set({
      ...body,
      updaterId: user!.id,
      updateDate: new Date(),
    })
    .where(eq(sessionsTable.id, id))
    .returning();

  // 상태가 변경된 경우 전용 메시지 반환
  if (body.status && body.status !== session.status) {
    return BaseResponse.data(
      updatedSession,
      RESPONSE_CODE.OK,
      RESPONSE_MESSAGE.SESSION_STATUS_UPDATED(String(id), session.status!, body.status)
    );
  }

  return BaseResponse.data(updatedSession, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_SESSION_SUCCESS);
});
