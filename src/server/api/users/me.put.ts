export default defineEventHandler(async (event) => {
  const body = await readBody<UserUpdateDto>(event);

  const { user, error, } = await authHelper(event);
  if (error) return error;

  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const findUser = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, user!.id),
  });

  if (!findUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND);
  }

  if (body.name && body.name !== findUser.name) {
    const existName = await db
      .select({ value: count(), })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.name, body.name),
          ne(usersTable.id, user!.id)
        )
      );

    if (existName[0]!.value > 0) {
      return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.USERNAME_ALREADY_EXISTS);
    }
  }

  const updateUser = await db.update(usersTable).set({
    name: body.name || findUser.name,
    role: body.role || findUser.role,
    ...resolveCommonMetaUpdate(body, findUser, user!.id),
  }).where(
    eq(usersTable.id, user!.id)
  ).returning();

  return BaseResponse.data(updateUser[0], RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_USER_SUCCESS);
});
