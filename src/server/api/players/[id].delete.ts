export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));

  const { user, isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseApiResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.DELETE_PLAYER_FORBIDDEN);
  }

  if (!Number.isFinite(id)) {
    return BaseApiResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

  const findUser = await db.query.playersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!findUser) {
    return BaseApiResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
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
        eq(playersTable.id, id),
        eq(playersTable.deleteYn, 'N')
      )
    );

  return BaseApiResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_PLAYER_SUCCESS);
});
