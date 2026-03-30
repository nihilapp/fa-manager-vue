export default defineEventHandler(async (event) => {
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

  const query = getQuery<CharacterQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  const { user, isAdmin, error, } = await authHelper(event);
  if (error) return error;

  const scopedQuery: CharacterQueryDto = isAdmin
    ? { ...query }
    : {
        ...query,
        userId: user!.id,
      };

  const columns = getTableColumns(charactersTable);
  const where = buildDrizzleWhere<CharacterQueryDto>(scopedQuery, {
    id: 'eq',
    idList: 'in',
    userId: 'eq',
    campaignId: 'eq',
    name: 'like',
    status: 'eq',
    race: 'like',
    currentLevel: 'dynamic',
    str: 'dynamic',
    dex: 'dynamic',
    con: 'dynamic',
    int: 'dynamic',
    wis: 'dynamic',
    cha: 'dynamic',
    ac: 'dynamic',
    hp: 'dynamic',
    speed: 'like',
    vision: 'like',
    skills: 'like',
    advantage: 'like',
    disadvantage: 'like',
    resistance: 'like',
    immunity: 'like',
    useYn: 'eq',
    deleteYn: 'eq',
  }, columns);

  const totalRes = await db
    .select({ count: count(), })
    .from(charactersTable)
    .where(
      isAdmin
        ? undefined
        : eq(charactersTable.userId, user!.id)
    );
  const totalElements = totalRes[0]!.count;

  const filteredRes = await db
    .select({ count: count(), })
    .from(charactersTable)
    .where(where);
  const filteredElements = filteredRes[0]!.count;

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  const list = await db.query.charactersTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
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

  const listData = new ListData<CharacterOutDto>(
    (list as any[]).map((character) => {
      const classes = character.classes || [];
      const sessions = character.sessions || [];
      const currentCurrency = sumCurrentCurrency(character.currencyTransactions || []);

      const currentLevel = classes.reduce((acc: number, curr: any) => acc + (curr.level || 0), 0) || character.startLevel || 1;
      const sessionExp = sessions.reduce((acc: number, curr: any) => acc + (curr.session?.rewardExp || 0), 0);

      return {
        ...character,
        currentLevel,
        currentExp: (character.startExp || 0) + sessionExp,
        currentCurrencyCp: currentCurrency.cp,
        currentCurrencySp: currentCurrency.sp,
        currentCurrencyEp: currentCurrency.ep,
        currentCurrencyGp: currentCurrency.gp,
        currentCurrencyPp: currentCurrency.pp,
      } as CharacterOutDto;
    }),
    totalElements,
    filteredElements,
    isPaged
      ? page
      : 0,
    isPaged
      ? size
      : 0
  );

  return BaseApiResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CHARACTER_LIST_SUCCESS);
});

