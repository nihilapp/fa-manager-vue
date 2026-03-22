type AuthResolvedUser = UserOutDto & { id: number };

const isAdminRole = (role?: UserOutDto['role']) => role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN';
const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';

const createAuthContext = (
  user: AuthResolvedUser | null,
  error: BaseResponseType | null,
  isDevelopmentBypass = false
) => {
  const isAdmin = isAdminRole(user?.role);

  const hasPermission = (resourceUserId?: number | null) => {
    if (isDevelopmentBypass) {
      return true;
    }

    if (!user) {
      return false;
    }

    if (isAdmin) {
      return true;
    }

    return resourceUserId === user.id;
  };

  const checkAdmin = () => isAdmin;

  const canAccessSelf = () => {
    if (isDevelopmentBypass) {
      return true;
    }

    if (!user) {
      return false;
    }

    return isAdmin || hasPermission(user.id);
  };

  const requireUser = () => {
    if (user) {
      return user;
    }

    return null;
  };

  return {
    user,
    isAdmin,
    isDevelopmentBypass,
    hasPermission,
    checkAdmin,
    canAccessSelf,
    requireUser,
    error,
  };
};

/**
 * 요청자의 정보를 확인하고 관리자 권한 또는 소유권을 검증하는 헬퍼
 */
export const authHelper = async (event: H3Event) => {
  if (isDevelopmentEnvironment) {
    const discordId = getDiscordId(event);

    const isDevDiscordId = discordId
      ? discordId
      : process.env.ADMIN_DISCORD_ID;

    if (!isDevDiscordId) {
      return createAuthContext(
        null,
        BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID),
        true
      );
    }

    const requestedUser = await db.query.usersTable.findFirst({
      where: (table, { eq, }) => {
        return eq(table.discordId, isDevDiscordId);
      },
    });

    if (!requestedUser) {
      return createAuthContext(
        null,
        BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND),
        true
      );
    }

    return createAuthContext(
      requestedUser as AuthResolvedUser,
      null,
      true
    );
  }

  const discordId = getDiscordId(event);

  if (!discordId) {
    return createAuthContext(
      null,
      BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID)
    );
  }

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.discordId, discordId),
  });

  if (!user) {
    return createAuthContext(
      null,
      BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND)
    );
  }

  return createAuthContext(user as AuthResolvedUser, null);
};
