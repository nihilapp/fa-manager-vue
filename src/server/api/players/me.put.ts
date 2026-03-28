export default defineEventHandler(async (event) => {
  const body = await readBody<PlayerUpdateDto>(event);

  const { user, error, } = await authHelper(event);
  if (error) return error;

  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const findUser = await db.query.playersTable.findFirst({
    where: (table, { eq, }) => eq(table.id, user!.id),
  });

  if (!findUser) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  if (body.name && body.name !== findUser.name) {
    const existName = await db
      .select({ value: count(), })
      .from(playersTable)
      .where(
        and(
          eq(playersTable.name, body.name),
          ne(playersTable.id, user!.id)
        )
      );

    if (existName[0]!.value > 0) {
      return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.PLAYER_NAME_ALREADY_EXISTS);
    }
  }

  const updateUser = await db.update(playersTable).set({
    name: body.name || findUser.name,
    role: findUser.role,
    status: findUser.status,
    ...resolveCommonMetaUpdate(body, findUser as unknown as CommonOutDto, user!.id),
  }).where(
    eq(playersTable.id, user!.id)
  ).returning();

  return BaseResponse.data(updateUser[0], RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_PLAYER_SUCCESS);
});
