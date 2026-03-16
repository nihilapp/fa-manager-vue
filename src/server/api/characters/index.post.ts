export default defineEventHandler(async (event) => {
  // ========== ========== ========== ==========
  // 간단 가이드
  // ========== ========== ========== ==========
  // 1. 쿼리 스트링: 제네릭을 통해 반환 값의 타입을 직접 지정합니다.
  // const query = getQuery<CharacterInDto>(event);

  // 5. 특정 헤더: 특정 헤더 값 하나만 가져옵니다. (대소문자 구분 없음)
  const discordId = event.req.headers.get('X-Discord-ID');
  if (!discordId) {
    return BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, 'X-Discord-ID 헤더가 필요합니다.');
  }

  // 7. 요청 바디: POST/PUT 요청의 본문을 가져오며, 제네릭으로 타이핑합니다.
  const body = await readBody<CharacterInDto>(event);

  // ========== ========== ========== ==========
  // 서비스 로직
  // ========== ========== ========== ==========

  const { user, error, } = await authHelper(event);
  if (error) return error;

  // 2. 캐릭터 생성 (userId 자동 할당)
  const [ character, ] = await db.insert(charactersTable).values({
    ...body,
    userId: user!.id, // 헤더로 확인된 유저의 ID 사용
    creatorId: user!.id,
  }).returning();

  // ========== ========== ========== ==========
  // 응답
  // ========== ========== ========== ==========

  return BaseResponse.data(character, RESPONSE_CODE.CREATED, RESPONSE_MESSAGE.CREATE_CHARACTER_SUCCESS);
});
