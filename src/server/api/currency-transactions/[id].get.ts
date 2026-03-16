export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = Number(getRouterParam(event, 'id'));

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========
  const transaction = await db.query.currencyTransactionsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
    with: {
      user: true,
      character: true,
    },
  });

  if (!transaction) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CURRENCY_TRANSACTION_NOT_FOUND);
  }

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(
    transaction as CurrencyTransactionOutDto,
    RESPONSE_CODE.OK,
    RESPONSE_MESSAGE.GET_CURRENCY_TRANSACTION_SUCCESS
  );
});
