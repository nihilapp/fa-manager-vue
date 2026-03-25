type AuthResolvedUser = UserOutDto & { id: number };
type DiscordIdentitySource = 'header' | 'cookie' | 'development';

const isAdminRole = (role?: UserOutDto['role']) => role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN';
const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
const DISCORD_ID_COOKIE_KEY = 'discord_id';
const DISCORD_ID_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getDiscordIdCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: !isDevelopmentEnvironment,
    path: '/',
    maxAge: DISCORD_ID_COOKIE_MAX_AGE,
  };
}

function resolveDiscordIdentity(event: H3Event): { discordId?: string; source?: DiscordIdentitySource; } {
  const headerDiscordId = getDiscordId(event);

  if (headerDiscordId) {
    return {
      discordId: headerDiscordId,
      source: 'header',
    };
  }

  const cookieDiscordId = getCookie(event, DISCORD_ID_COOKIE_KEY);

  if (cookieDiscordId) {
    return {
      discordId: cookieDiscordId,
      source: 'cookie',
    };
  }

  if (isDevelopmentEnvironment && process.env.ADMIN_DISCORD_ID) {
    return {
      discordId: process.env.ADMIN_DISCORD_ID,
      source: 'development',
    };
  }

  return {};
}

function persistDiscordIdCookie(event: H3Event, discordId: string) {
  setCookie(event, DISCORD_ID_COOKIE_KEY, discordId, getDiscordIdCookieOptions());
}

function clearDiscordIdCookie(event: H3Event) {
  deleteCookie(event, DISCORD_ID_COOKIE_KEY, {
    path: '/',
  });
}

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
  const { discordId, source, } = resolveDiscordIdentity(event);

  if (!discordId) {
    if (isDevelopmentEnvironment) {
      return createAuthContext(
        null,
        BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID),
        true
      );
    }

    return createAuthContext(
      null,
      BaseResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID)
    );
  }

  const user = await db.query.usersTable.findFirst({
    where: (table, { eq, }) => eq(table.discordId, discordId),
  });

  if (!user) {
    if (source === 'cookie') {
      clearDiscordIdCookie(event);
    }

    return createAuthContext(
      null,
      BaseResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.USER_NOT_FOUND),
      source === 'development'
    );
  }

  if (source === 'header' || source === 'cookie') {
    persistDiscordIdCookie(event, discordId);
  }

  return createAuthContext(user as AuthResolvedUser, null, source === 'development');
};
