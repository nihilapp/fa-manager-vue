export default defineEventHandler(async (event) => {
  const { user, error, } = await authHelper(event);
  if (error) return error;

  const findUser = await db.query.playersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, user!.id),
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
        eq(playersTable.id, user!.id),
        eq(playersTable.deleteYn, 'N')
      )
    );

  return BaseApiResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_PLAYER_SUCCESS);
});

