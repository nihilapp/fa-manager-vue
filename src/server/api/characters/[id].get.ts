export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
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
      consumeHistories: true,
    },
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  // 2. 동적 필드 계산 (currentLevel, currentExp, currentCurrency)
  const classes = character.classes || [];
  const sessions = character.sessions || [];
  const consumes = character.consumeHistories || [];

  // currentLevel: 클래스 레벨의 총합
  const currentLevel = classes.reduce((acc, curr) => acc + (curr.level || 0), 0) || character.startLevel || 1;

  // currentExp: 시작 경험치 + 세션 보상 경험치 총합
  const sessionExp = sessions.reduce((acc, curr) => acc + (curr.session?.rewardExp || 0), 0);
  const currentExp = (character.startExp || 0) + sessionExp;

  // currentCurrency: 시작 소지금 + 세션 보상 골드 총합 - 소모 내역 총합 (GP 기준)
  const sessionGold = sessions.reduce((acc, curr) => acc + (curr.session?.rewardGold || 0), 0);
  const consumeGold = consumes.reduce((acc, curr) => acc + ((curr.beforeCurrency as any).gp - (curr.afterCurrency as any).gp), 0);
  const currentCurrencyGp = (character.startCurrencyGp || 0) + sessionGold - consumeGold;

  // 결과 객체 구성 (CharacterOutDto 타입에 맞춤)
  const result: CharacterOutDto = {
    ...character,
    currentLevel,
    currentExp,
    currentCurrencyGp,
    // 필요 시 다른 통화들도 시작값 그대로 노출하거나 추가 계산 가능
    currentCurrencyCp: character.startCurrencyCp,
    currentCurrencySp: character.startCurrencySp,
    currentCurrencyEp: character.startCurrencyEp,
    currentCurrencyPp: character.startCurrencyPp,
  } as CharacterOutDto;

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  return BaseResponse.data(result, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_CHARACTER_SUCCESS);
});
