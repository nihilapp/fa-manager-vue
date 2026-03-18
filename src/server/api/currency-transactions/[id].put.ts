export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody<CurrencyTransactionUpdateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========
  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const { user, isAdmin, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  const transaction = await db.query.currencyTransactionsTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!transaction) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CURRENCY_TRANSACTION_NOT_FOUND);
  }

  if (!hasPermission(transaction.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CURRENCY_TRANSACTION_FORBIDDEN);
  }

  const nextTransactionType = body.transactionType || transaction.transactionType;
  if (nextTransactionType === 'INIT' && transaction.transactionType !== 'INIT') {
    const initTransaction = await db.query.currencyTransactionsTable.findFirst({
      where: (table, { eq, and, ne, }) => and(
        eq(table.characterId, transaction.characterId),
        eq(table.transactionType, 'INIT'),
        eq(table.deleteYn, 'N'),
        ne(table.id, id)
      ),
    });

    if (initTransaction) {
      return BaseResponse.error(RESPONSE_CODE.CONFLICT, RESPONSE_MESSAGE.CHARACTER_INIT_TRANSACTION_ALREADY_EXISTS);
    }
  }

  const [ updatedTransaction, ] = await db.update(currencyTransactionsTable)
    .set({
      transactionType: nextTransactionType,
      description: body.description ?? transaction.description,
      deltaPp: body.deltaPp ?? transaction.deltaPp,
      deltaGp: body.deltaGp ?? transaction.deltaGp,
      deltaEp: body.deltaEp ?? transaction.deltaEp,
      deltaSp: body.deltaSp ?? transaction.deltaSp,
      deltaCp: body.deltaCp ?? transaction.deltaCp,
      ...resolveCommonMetaUpdate(body, transaction, user!.id),
    })
    .where(eq(currencyTransactionsTable.id, id))
    .returning();

  const result = await db.query.currencyTransactionsTable.findFirst({
    where: (table, { eq, }) => eq(table.id, updatedTransaction!.id),
    with: {
      user: true,
      character: true,
    },
  });

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(
    result as CurrencyTransactionOutDto,
    RESPONSE_CODE.OK,
    RESPONSE_MESSAGE.UPDATE_CURRENCY_TRANSACTION_SUCCESS
  );
});
