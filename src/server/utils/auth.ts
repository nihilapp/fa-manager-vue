/**
 * X-Discord-ID 헤더를 확인하여 등록된 사용자 정보를 반환합니다.
 * 실패 시 ApiResponse 객체를 반환하며, 성공 시 User 객체를 반환합니다.
 */
export const getValidatedUser = async (event: any) => {
  const discordIdHeader = getHeader(event, 'X-Discord-ID');

  if (!discordIdHeader) {
    return createResponse(
      null,
      true,
      '인증을 위해 X-Discord-ID 헤더가 필요합니다.',
      'UNAUTHORIZED'
    );
  }

  const discordId = String(discordIdHeader).trim();

  if (!discordId) {
    return createResponse(
      null,
      true,
      '유효하지 않은 디스코드 ID 형식입니다.',
      'BAD_REQUEST'
    );
  }

  const user = await db.query.users.findFirst({
    where: eq(users.discordId, discordId),
  });

  if (!user) {
    return createResponse(
      null,
      true,
      '등록되지 않은 사용자입니다. 먼저 유저 등록을 진행해주세요.',
      'FORBIDDEN'
    );
  }

  // 성공 시 순수 유저 객체만 반환 (여기에는 error 속성이 없음)
  return user;
};

/**
 * 사용자가 어드민 권한을 가지고 있는지 확인합니다.
 */
export const isAdmin = (user: any) => {
  return user && user.role === 'ADMIN';
};

/**
 * 어드민 권한이 없는 경우 에러 응답을 반환합니다.
 */
export const ensureAdmin = async (event: any) => {
  const result = await getValidatedUser(event);

  // ApiResponse 객체인지(에러인지) 판별하는 로직 수정
  // User 객체는 id를 반드시 가지므로, id가 없으면 에러 응답으로 간주
  if (!result || !('id' in result)) {
    return result;
  }

  if (!isAdmin(result)) {
    return createResponse(
      null,
      true,
      '어드민 권한이 필요합니다.',
      'FORBIDDEN'
    );
  }

  return result;
};
