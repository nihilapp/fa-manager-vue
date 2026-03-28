export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = getRouterParam(event, 'id');

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 권한 확인 (X-Discord-ID 헤더 체크 및 유저 검증 포함)
  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  const findUser = await db.query.playersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, Number(id)),
  });

  if (!findUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  // 본인이거나 관리자여야 함
  if (!hasPermission(findUser.id)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.DELETE_PLAYER_FORBIDDEN);
  }

  await db.update(playersTable)
    .set({
      useYn: 'N',
      deleteYn: 'Y',
      updaterId: user!.id,
      updateDate: new Date(),
      deleterId: user!.id,
      deleteDate: new Date(),
    })
    .where(
      and(
        eq(playersTable.id, Number(id)),
        eq(playersTable.deleteYn, 'N')
      )
    );

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_PLAYER_SUCCESS);
});
