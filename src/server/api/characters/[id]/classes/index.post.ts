async function loadCharacterDetail(characterId: number) {
  function sumCurrentCurrency(transactions: TypeCurrencyTransaction[] = []) {
    return transactions
      .filter((transaction) => transaction.deleteYn !== 'Y')
      .reduce((acc, transaction) => {
        acc.cp += transaction.deltaCp || 0;
        acc.sp += transaction.deltaSp || 0;
        acc.ep += transaction.deltaEp || 0;
        acc.gp += transaction.deltaGp || 0;
        acc.pp += transaction.deltaPp || 0;

        return acc;
      }, {
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0,
      });
  }

  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, characterId),
      eq(table.deleteYn, 'N')
    ),
    with: {
      user: true,
      campaign: true,
      classes: true,
      sessions: {
        with: {
          session: true,
        },
      },
      currencyTransactions: true,
    },
  });

  if (!character) {
    return null;
  }

  const currentCurrency = sumCurrentCurrency(character.currencyTransactions || []);
  const currentLevel = (character.classes || []).reduce((acc, item) => acc + (item.level || 0), 0) || character.startLevel || 1;
  const currentExp = (character.startExp || 0) + (character.sessions || []).reduce((acc, item) => acc + (item.session?.rewardExp || 0), 0);

  return {
    ...character,
    currentLevel,
    currentExp,
    currentCurrencyCp: currentCurrency.cp,
    currentCurrencySp: currentCurrency.sp,
    currentCurrencyEp: currentCurrency.ep,
    currentCurrencyGp: currentCurrency.gp,
    currentCurrencyPp: currentCurrency.pp,
  } as unknown as CharacterOutDto;
}

export default defineEventHandler(async (event) => {
  const characterId = Number(getRouterParam(event, 'id'));
  const body = await readBody<CharacterClassCreateDto>(event);

  if (!Number.isFinite(characterId) || !body?.className?.trim()) {
    return BaseApiResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  const { hasPermission, error, } = await authHelper(event);
  if (error) return error;

  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, characterId),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseApiResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  if (!hasPermission(character.userId)) {
    return BaseApiResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  const className = body.className.trim();
  const existingClass = await db.query.characterClassesTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.characterId, characterId),
      eq(table.className, className)
    ),
  });

  if (existingClass) {
    return BaseApiResponse.error(RESPONSE_CODE.CONFLICT, RESPONSE_MESSAGE.CONFLICT);
  }

  await db.insert(characterClassesTable).values({
    characterId,
    className,
    subClassName: body.subClassName?.trim() ?? '',
    level: body.level ?? 1,
  });

  const result = await loadCharacterDetail(characterId);

  return BaseApiResponse.data(
    result as unknown as CharacterOutDto,
    RESPONSE_CODE.CREATED,
    RESPONSE_MESSAGE.CREATE_CHARACTER_CLASS_SUCCESS
  );
});
