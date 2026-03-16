export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = Number(getRouterParam(event, 'id'));

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========
  const { user, isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CURRENCY_TRANSACTION_ADMIN_ONLY);
  }

  const transaction = await db.query.currencyTransactionsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!transaction) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CURRENCY_TRANSACTION_NOT_FOUND);
  }

  await db.update(currencyTransactionsTable)
    .set({
      useYn: 'N',
      deleteYn: 'Y',
      updaterId: user!.id,
      updateDate: new Date(),
      deleterId: user!.id,
      deleteDate: new Date(),
    })
    .where(eq(currencyTransactionsTable.id, id));

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(null, RESPONSE_CODE.OK, RESPONSE_MESSAGE.DELETE_CURRENCY_TRANSACTION_SUCCESS);
});
