export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'));
  const query = getQuery<SessionQueryDto>(event);
  query.deleteYn = query.deleteYn || 'N';

  const { isAdmin, error, } = await authHelper(event);
  if (error) return error;

  if (!isAdmin) {
    return BaseApiResponse.error(RESPONSE_CODE.FORBIDDEN, RESPONSE_MESSAGE.PLAYER_FORBIDDEN);
  }

  if (!Number.isFinite(id)) {
    return BaseApiResponse.error(RESPONSE_CODE.BAD_REQUEST, RESPONSE_MESSAGE.BAD_REQUEST);
  }

  const player = await db.query.playersTable.findFirst({
    where: (table, { eq, and, }) => and(
      eq(table.id, id),
      eq(table.deleteYn, 'N')
    ),
    columns: {
      id: true,
    },
  });

  if (!player) {
    return BaseApiResponse.error(RESPONSE_CODE.NOT_FOUND, RESPONSE_MESSAGE.PLAYER_NOT_FOUND);
  }

  const participantRows = await db.query.sessionPlayersTable.findMany({
    where: (table, { eq, and, }) => and(
      eq(table.userId, id),
      eq(table.deleteYn, 'N'),
      query.role
        ? eq(table.role, query.role)
        : undefined,
      Number.isFinite(Number(query.characterId))
        ? eq(table.characterId, Number(query.characterId))
        : undefined
    ),
    columns: {
      sessionId: true,
    },
  });

  const sessionIds = Array.from(new Set(participantRows
    .map((participant) => participant.sessionId)
    .filter((sessionId): sessionId is number => Number.isFinite(sessionId))));

  const page = Number(query.page || 0);
  const size = Number(query.size || 0);
  const isPaged = size > 0;

  if (sessionIds.length === 0) {
    const listData = new ListData<SessionOutDto>([], 0, 0, isPaged
      ? page
      : 0, isPaged
      ? size
      : 0);
    return BaseApiResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_SESSION_LIST_SUCCESS);
  }

  const columns = getTableColumns(sessionsTable);
  const baseWhere = buildDrizzleWhere<SessionQueryDto>(query, {
    id: 'eq',
    idList: 'in',
    campaignId: 'eq',
    no: 'eq',
    status: 'dynamic',
    name: 'like',
    useYn: 'eq',
    deleteYn: 'eq',
  }, columns);

  const participantWhere = inArray(sessionsTable.id, sessionIds);
  const where = baseWhere
    ? and(baseWhere, participantWhere)
    : participantWhere;

  const totalRes = await db
    .select({ count: count(), })
    .from(sessionsTable)
    .where(participantWhere);
  const totalElements = totalRes[0]?.count ?? 0;

  const filteredRes = await db
    .select({ count: count(), })
    .from(sessionsTable)
    .where(where);
  const filteredElements = filteredRes[0]?.count ?? 0;

  const list = await db.query.sessionsTable.findMany({
    where,
    orderBy: sortHelper(query.sort || '', columns) as SQL[],
    limit: isPaged
      ? size
      : undefined,
    offset: isPaged
      ? page * size
      : undefined,
    with: {
      campaign: true,
      players: {
        with: {
          character: true,
          user: true,
        },
      },
    },
  });

  const listData = new ListData<SessionOutDto>(
    list as SessionOutDto[],
    totalElements,
    filteredElements,
    isPaged
      ? page
      : 0,
    isPaged
      ? size
      : 0
  );

  return BaseApiResponse.page(listData, RESPONSE_CODE.OK, RESPONSE_MESSAGE.GET_SESSION_LIST_SUCCESS);
});
