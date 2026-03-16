export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 기본 정보
  // ========== ========== ========== ==========
  const id = Number(getRouterParam(event, 'id'));
  const body = await readBody<CharacterUpdateDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  // 1. 권한 확인 (X-Discord-ID 헤더 체크 및 유저 검증 포함)
  const { user, hasPermission, error, } = await authHelper(event);
  if (error) return error;

  // 2. 필수값 확인
  if (!body) {
    return BaseResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.REQUIRED_FIELDS_MISSING);
  }

  // 3. 캐릭터 존재 여부 확인
  const character = await db.query.charactersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
  });

  if (!character) {
    return BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.CHARACTER_NOT_FOUND);
  }

  // 4. 소유권 확인
  if (!hasPermission(character.userId)) {
    return BaseResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.CHARACTER_FORBIDDEN);
  }

  // 5. 캐릭터 수정
  const [ updatedCharacter, ] = await db.update(charactersTable)
    .set({
      name: body.name,
      campaignId: body.campaignId,
      status: body.status,
      race: body.race,
      startLevel: body.startLevel,
      startExp: body.startExp,

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

      useYn: body.useYn,
      deleteYn: body.deleteYn,

      updaterId: user!.id,
      updateDate: new Date(),
    })
    .where(eq(charactersTable.id, id))
    .returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========
  return BaseResponse.data(updatedCharacter, RESPONSE_CODE.OK, RESPONSE_MESSAGE.UPDATE_CHARACTER_SUCCESS);
});
