export default defineEventHandler(async (event) => {
  const sumCurrentCurrency = (transactions: TypeCurrencyTransaction[] = []) => {
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
  };

  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = Number(getRouterParam(event, 'id'));

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 캐릭터 상세 조회 (관계 데이터 포함)
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
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
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  // 2. 동적 필드 계산 (currentLevel, currentExp, currentCurrency)
  const classes = character.classes || [];
  const sessions = character.sessions || [];
  const currentCurrency = sumCurrentCurrency(character.currencyTransactions || []);

  const currentLevel = classes.reduce((acc, curr) => acc + (curr.level || 0), 0) || character.startLevel || 1;
  const sessionExp = sessions.reduce((acc, curr) => acc + (curr.session?.rewardExp || 0), 0);
  const currentExp = (character.startExp || 0) + sessionExp;

  // 3. 결과 객체 구성 (CharacterOutDto 타입에 맞춤)
  const result: CharacterOutDto = {
    ...character,
    classes: classes.map((item) => ({
      ...item,
      character: null,
    })),
    currentLevel,
    currentExp,
    currentCurrencyCp: currentCurrency.cp,
    currentCurrencySp: currentCurrency.sp,
    currentCurrencyEp: currentCurrency.ep,
    currentCurrencyGp: currentCurrency.gp,
    currentCurrencyPp: currentCurrency.pp,
  } as unknown as CharacterOutDto;

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(result, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CHARACTER_SUCCESS);
});
