type AuthResolvedPlayer = PlayerOutDto & { id: number };
type DiscordIdentitySource = 'header' | 'cookie' | 'development';

function isAdminRole(role?: PlayerOutDto['role']) {
  return role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN';
}

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

function resolveDiscordIdentity(event: H3Event): { discordId?: string; source?: DiscordIdentitySource } {
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

  if (process.env.ADMIN_DISCORD_ID) {
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

function createDevelopmentFallbackUser(discordId?: string): AuthResolvedPlayer {
  return {
    id: 0,
    discordId: discordId || 'development',
    name: 'Development',
    role: 'ROLE_SUPER_ADMIN',
    status: 'ACTIVE',
    useYn: 'Y',
    deleteYn: 'N',
    creatorId: null,
    createDate: null,
    updaterId: null,
    updateDate: null,
    deleterId: null,
    deleteDate: null,
  };
}

async function resolveDevelopmentUser(discordId?: string, source?: DiscordIdentitySource) {
  if (discordId) {
    const matchedUser = await db.query.playersTable.findFirst({
      where: (table, { eq, }) => eq(table.discordId, discordId),
    });

    if (matchedUser) {
      return {
        user: matchedUser as AuthResolvedPlayer,
        shouldClearCookie: false,
      };
    }
  }

  const firstUser = await db.query.playersTable.findFirst({
    where: (table, { eq, }) => eq(table.deleteYn, 'N'),
  });

  if (firstUser) {
    return {
      user: firstUser as AuthResolvedPlayer,
      shouldClearCookie: source === 'cookie',
    };
  }

  return {
    user: createDevelopmentFallbackUser(discordId),
    shouldClearCookie: source === 'cookie',
  };
}

function createAuthContext(
  user: AuthResolvedPlayer | null,
  error: BaseApiResponse | null,
  isDevelopmentBypass = false
) {
  const isAdmin = isDevelopmentBypass || isAdminRole(user?.role);
  const actorId = user?.id ?? null;

  function hasPermission(resourcePlayerId?: number | null) {
    if (isAdmin) {
      return true;
    }

    if (!user) {
      return false;
    }

    return resourcePlayerId === user.id;
  }

  function checkAdmin() {
    return isAdmin;
  }

  function canAccessSelf() {
    if (isAdmin) {
      return true;
    }

    if (!user) {
      return false;
    }

    return hasPermission(user.id);
  }

  function requireUser() {
    if (user) {
      return user;
    }

    return null;
  }

  return {
    user,
    actorId,
    isAdmin,
    isDevelopmentBypass,
    hasPermission,
    checkAdmin,
    canAccessSelf,
    requireUser,
    error,
  };
}

/**
 * 요청자의 정보를 확인하고 관리자 권한 또는 소유권을 검증하는 헬퍼
 */
export async function authHelper(event: H3Event) {
  const { discordId, source, } = resolveDiscordIdentity(event);

  if (isDevelopmentEnvironment) {
    const { user, shouldClearCookie, } = await resolveDevelopmentUser(discordId, source);

    if (shouldClearCookie) {
      clearDiscordIdCookie(event);
    }

    if (discordId && (source === 'header' || source === 'cookie')) {
      persistDiscordIdCookie(event, discordId);
    }

    return createAuthContext(user, null, true);
  }

  if (!discordId) {
    return createAuthContext(
      null,
      BaseApiResponse.error(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.REQUIRE_DISCORD_ID)
    );
  }

  const user = await db.query.playersTable.findFirst({
    where: (table, { eq, }) => eq(table.discordId, discordId),
  });

  if (!user) {
    if (source === 'cookie') {
      clearDiscordIdCookie(event);
    }

    return createAuthContext(
      null,
      BaseApiResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND)
    );
  }

  if (source === 'header' || source === 'cookie') {
    persistDiscordIdCookie(event, discordId);
  }

  return createAuthContext(user as AuthResolvedPlayer, null, false);
}
