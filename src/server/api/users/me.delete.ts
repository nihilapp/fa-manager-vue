export default defineEventHandler(async (event) => {
  const { user, error, } = await authHelper(event);
  if (error) return error;

  const findUser = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, user!.id),
  });

  if (!findUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND);
  }

  await db.update(usersTable)
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
        eq(usersTable.id, user!.id),
        eq(usersTable.deleteYn, 'N')
      )
    );

  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_USER_SUCCESS);
});
