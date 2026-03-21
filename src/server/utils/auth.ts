import { RESPONSE_CODE } from '@server/constant/response-code';
import { RESPONSE_MESSAGE } from '@server/constant/response-message';
import { db } from '@server/utils/drizzle';
import { getDiscordId } from '@server/utils/request-header';

import { BaseResponse } from './base-response';

/**
 * 요청자의 정보를 확인하고 관리자 권한 또는 소유권을 검증하는 헬퍼
 */
export const authHelper = async (event: H3Event) => {
  const discordId = getDiscordId(event);
  const fallbackUser = { id: 0, } as UserOutDto & { id: number };
  const denyPermission = () => false as const;

  if (!discordId) {
    return {
      user: fallbackUser,
      isAdmin: false,
      hasPermission: denyPermission,
      checkAdmin: denyPermission,
      error: BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID),
    };
  }

  // 1. 유저 조회
  const user = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.discordId, discordId),
  });

  if (!user) {
    return {
      user: fallbackUser,
      isAdmin: false,
      hasPermission: denyPermission,
      checkAdmin: denyPermission,
      error: BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND),
    };
  }

  const isAdmin = user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUPER_ADMIN';

  /**
   * 권한 체크 내부 함수 (본인 또는 관리자 여부)
   * @param resourceUserId 리소스 소유자 또는 조작 대상 사용자의 ID
   */
  const hasPermission = (resourceUserId?: number | null) => {
    if (isAdmin) return true; // 어드민은 무조건 통과
    return resourceUserId === user.id; // 일반 유저는 본인(ID 일치)만 가능
  };

  /**
   * 관리자 권한 여부를 명시적으로 확인
   */
  const checkAdmin = () => isAdmin;

  return {
    user: user as UserOutDto & { id: number },
    isAdmin,
    hasPermission,
    checkAdmin,
    error: null,
  };
};
