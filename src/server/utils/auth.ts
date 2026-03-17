/**
 * 요청자의 정보를 확인하고 관리자 권한 또는 소유권을 검증하는 헬퍼
 */
export const authHelper = async (event: H3Event) => {
  const discordId = getDiscordId(event);

  if (!discordId) {
    return {
      user: null,
      error: BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID),
    };
  }

  // 1. 유저 조회
  const user = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.discordId, discordId),
  });

  if (!user) {
    return {
      user: null,
      error: BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND),
    };
  }

  const isAdmin = user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUPER_ADMIN';

  /**
   * 권한 체크 내부 함수
   * @param resourceUserId 리소스 소유자의 ID (null일 수 있음)
   */
  const hasPermission = (resourceUserId?: number | null) => {
    if (isAdmin) return true; // 어드민은 패스
    return resourceUserId === user.id; // 일반 유저는 본인 확인
  };

  return {
    user: user as UserOutDto & { id: number },
    isAdmin,
    hasPermission,
    error: null,
  };
};
