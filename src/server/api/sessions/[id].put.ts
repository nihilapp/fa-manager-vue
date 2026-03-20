export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody<SessionUpdateDto>(event);

  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  if (!Number.isFinite(id) || !body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

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
  const isStatusChanged = body.status !== undefined && body.status !== session.status;
  const [ updatedSession, ] = await db.update(sessionsTable)
    .set({
      no: body.no !== undefined
        ? body.no
        : session.no,
      name: body.name !== undefined
        ? body.name
        : session.name,
      description: body.description !== undefined
        ? body.description
        : session.description,
      maxPlayer: body.maxPlayer !== undefined
        ? body.maxPlayer
        : session.maxPlayer,
      rewardExp: body.rewardExp !== undefined
        ? body.rewardExp
        : session.rewardExp,
      rewardGold: body.rewardGold !== undefined
        ? body.rewardGold
        : session.rewardGold,
      status: body.status !== undefined
        ? body.status
        : session.status,
      playDate: body.playDate !== undefined
        ? (body.playDate
          ? new Date(body.playDate)
          : null)
        : session.playDate,
      ...resolveCommonMetaUpdate(body, session as unknown as CommonOutDto, user!.id),
    })
    .where(eq(sessionsTable.id, id))
    .returning();

  // 상태가 변경된 경우 전용 메시지 반환
  if (isStatusChanged) {
    return BaseResponse.data(
      updatedSession,
      RESPONSE_CODE.OK,
      RESPONSE_MESSAGE.SESSION_STATUS_UPDATED(String(id), String(session.status), String(body.status))
    );
  }

  return BaseResponse.data(updatedSession, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_SESSION_SUCCESS);
});
