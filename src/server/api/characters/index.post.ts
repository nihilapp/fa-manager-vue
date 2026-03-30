export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const body = await readBody<CharacterCreateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 필수값 확인
  if (!body || !body.name || !body.race) {
    return BaseApiResponse.error(
      RESPONSE_CODE.BAD_REQUEST,
      RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING
    );
  }

  // 2. 권한 확인 (X-Discord-ID 헤더 체크 및 유저 검증 포함)
  const { user, isAdmin, error, } = await authHelper(event);
  if (error) return error;

  // 관리자가 아니면 무조건 본인 ID 사용, campaignId는 null 처리
  const targetUserId = isAdmin
    ? (body.userId || user!.id)
    : user!.id;
  const targetCampaignId = isAdmin
    ? body.campaignId
    : null;

  // 3. 캐릭터 생성 및 시작 자금 INIT 거래 생성
  const character = await db.transaction(async (tx) => {
    const [ createdCharacter, ] = await tx.insert(charactersTable).values({
      userId: targetUserId,
      creatorId: user!.id,
      name: body.name,
      race: body.race,
      campaignId: targetCampaignId,
      status: body.status || 'ACTIVE',
      startLevel: body.startLevel || 0,
      startExp: body.startExp || 0,

      // D&D Stats
      str: body.str,
      dex: body.dex,
      con: body.con,
      int: body.int,
      wis: body.wis,
      cha: body.cha,
      ac: body.ac,
      hp: body.hp,
      speed: body.speed,
      vision: body.vision,
      skills: body.skills,
      advantage: body.advantage,
      disadvantage: body.disadvantage,
      resistance: body.resistance,
      immunity: body.immunity,

      // Equipment
      mainHand: body.mainHand,
      offHand: body.offHand,
      armor: body.armor,
      head: body.head,
      gauntlet: body.gauntlet,
      boots: body.boots,
      belt: body.belt,
      cloak: body.cloak,
      accessory1: body.accessory1,
      accessory2: body.accessory2,
      accessory3: body.accessory3,
      accessory4: body.accessory4,

      // Requirements
      reqStrDex8: body.reqStrDex8,
      reqStrDex10: body.reqStrDex10,
      reqStrDex12: body.reqStrDex12,
      reqStrDex14: body.reqStrDex14,
      reqStr16: body.reqStr16,
      reqStr18: body.reqStr18,
      reqStr20: body.reqStr20,
      reqCon8: body.reqCon8,
      reqCon10: body.reqCon10,
      reqCon12: body.reqCon12,
      reqCon14: body.reqCon14,
      reqCon16: body.reqCon16,
      reqCon18: body.reqCon18,
      reqCon20: body.reqCon20,
    }).returning();

    await tx.insert(currencyTransactionsTable).values({
      userId: user!.id,
      characterId: createdCharacter!.id,
      transactionType: 'INIT',
      description: '캐릭터 생성',
      deltaCp: body.startCurrencyCp ?? 0,
      deltaSp: body.startCurrencySp ?? 0,
      deltaEp: body.startCurrencyEp ?? 0,
      deltaGp: body.startCurrencyGp ?? 0,
      deltaPp: body.startCurrencyPp ?? 0,
      creatorId: user!.id,
      createDate: new Date(),
    });

    return createdCharacter;
  });

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseApiResponse.data(character, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_CHARACTER_SUCCESS);
});

