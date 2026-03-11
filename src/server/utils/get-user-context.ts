import { type H3Event } from 'h3';

/**
 * X-Discord-ID 헤더를 확인하여 등록된 사용자의 내부 ID를 반환합니다.
 * 성공 시 사용자 ID(bigint)를 반환하고, 실패 시 ApiResponse 객체를 반환합니다.
 */
export const getValidatedUserId = async (event: H3Event): Promise<bigint | ReturnType<typeof createResponse<null>>> => {
  const discordIdHeader = getHeader(event, 'X-Discord-ID');

  if (!discordIdHeader) {
    return createResponse(
      null,
      true,
      '인증을 위해 X-Discord-ID 헤더가 필요합니다.',
      'UNAUTHORIZED'
    );
  }

  const discordId = discordIdHeader;

  if (!/^\d+$/.test(discordId)) {
    return createResponse(
      null,
      true,
      '유효하지 않은 디스코드 ID 형식입니다.',
      'BAD_REQUEST'
    );
  }

  // prisma auto-import를 우선 사용 (오류 시 서버/db/index 등에서 직접 임포트 권장)
  const user = await prisma.user.findFirst({
    where: { discordId, },
  });

  if (!user) {
    return createResponse(
      null,
      true,
      '등록되지 않은 사용자입니다. 먼저 유저 등록을 진행해주세요.',
      'FORBIDDEN'
    );
  }

  return user.id;
};
